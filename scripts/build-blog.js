const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const OUTPUT_DIR = path.join(ROOT, 'blog');
const TEMPLATE_DIR = path.join(__dirname, 'templates');
const SITE_URL = 'https://craigdennis.me';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function readTemplate(name) {
  return fs.readFileSync(path.join(TEMPLATE_DIR, name), 'utf8');
}

function renderTemplate(template, values) {
  return Object.entries(values).reduce(
    (html, [key, value]) => html.replaceAll(`{{${key}}}`, value ?? ''),
    template
  );
}

function normalizeDate(dateValue) {
  if (dateValue instanceof Date) {
    if (Number.isNaN(dateValue.getTime())) {
      throw new Error(`Invalid date: ${dateValue}`);
    }
    return dateValue.toISOString().slice(0, 10);
  }

  const str = String(dateValue).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateValue}`);
  }
  return date.toISOString().slice(0, 10);
}

function formatDateDisplay(dateValue) {
  const iso = normalizeDate(dateValue);
  const date = new Date(`${iso}T12:00:00Z`);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatDateIso(dateValue) {
  return normalizeDate(dateValue);
}

function slugFromFilename(filename, frontmatter) {
  if (frontmatter.slug) return String(frontmatter.slug).trim();
  return path.basename(filename, '.md');
}

function renderTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return '';
  const items = tags
    .map((tag) => `<span class="blog-tag">${escapeHtml(tag)}</span>`)
    .join('');
  return `<span class="blog-tags">${items}</span>`;
}

function renderPostCard(post) {
  const tagLabel = Array.isArray(post.tags) && post.tags.length > 0
    ? escapeHtml(post.tags[0])
    : formatDateDisplay(post.date);

  return `<a class="clip-card" href="/blog/${escapeHtml(post.slug)}/">
  <div>
    <div class="clip-tag">${tagLabel}</div>
    <div class="clip-title">${escapeHtml(post.title)}</div>
    <p class="blog-card-desc">${escapeHtml(post.description)}</p>
  </div>
  <span class="clip-link"><span>Read post</span> →</span>
</a>`;
}

function renderArticleSchema(post) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: formatDateIso(post.date),
    author: {
      '@type': 'Person',
      name: 'Craig Dennis',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Craig Dennis',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}/`,
    },
  };

  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

function renderRss(posts) {
  const items = posts.map((post) => {
    const url = `${SITE_URL}/blog/${post.slug}/`;
    return `    <item>
      <title>${escapeHtml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeHtml(post.description)}</description>
      <pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate>
    </item>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Craig Dennis — Blog</title>
    <link>${SITE_URL}/blog/</link>
    <description>SEO architecture, content strategy, and AI-search visibility for B2B SaaS.</description>
    <language>en-gb</language>
${items}
  </channel>
</rss>
`;
}

function loadPosts() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    return { posts: [], drafts: 0 };
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith('.md'));
  const posts = [];
  let drafts = 0;

  for (const file of files) {
    const sourcePath = path.join(CONTENT_DIR, file);
    const parsed = matter(fs.readFileSync(sourcePath, 'utf8'));
    const { title, description, date, tags, draft } = parsed.data;

    if (draft === true) {
      drafts += 1;
      continue;
    }

    if (!title || !description || !date) {
      console.warn(`Skipping ${file}: title, description, and date are required.`);
      continue;
    }

    posts.push({
      title: String(title),
      description: String(description),
      date: normalizeDate(date),
      tags: Array.isArray(tags) ? tags : [],
      slug: slugFromFilename(file, parsed.data),
      contentHtml: marked.parse(parsed.content),
      sourceFile: file,
    });
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return { posts, drafts };
}

function writePage(outputPath, html) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html);
}

function build() {
  const layoutTemplate = readTemplate('layout.html');
  const postTemplate = readTemplate('post.html');
  const indexTemplate = readTemplate('index.html');
  const { posts, drafts } = loadPosts();

  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const post of posts) {
    const body = renderTemplate(postTemplate, {
      title: escapeHtml(post.title),
      description: escapeHtml(post.description),
      dateIso: formatDateIso(post.date),
      dateDisplay: formatDateDisplay(post.date),
      tagsHtml: renderTags(post.tags),
      content: post.contentHtml,
    });

    const html = renderTemplate(layoutTemplate, {
      title: `${escapeHtml(post.title)} — Craig Dennis`,
      ogTitle: escapeHtml(post.title),
      description: escapeHtml(post.description),
      canonicalUrl: `${SITE_URL}/blog/${post.slug}/`,
      ogType: 'article',
      extraHead: renderArticleSchema(post),
      body,
    });

    writePage(path.join(OUTPUT_DIR, post.slug, 'index.html'), html);
  }

  const postCards = posts.map(renderPostCard).join('\n');
  const emptyState = posts.length === 0
    ? '<p class="muted blog-empty">No posts yet. Add a markdown file to <code>content/blog/</code> and run <code>npm run build</code>.</p>'
    : '';

  const indexBody = renderTemplate(indexTemplate, {
    postCards,
    emptyState,
  });

  const indexHtml = renderTemplate(layoutTemplate, {
    title: 'Blog — Craig Dennis',
    ogTitle: 'Blog — Craig Dennis',
    description: 'SEO architecture, content strategy, and AI-search visibility for B2B SaaS.',
    canonicalUrl: `${SITE_URL}/blog/`,
    ogType: 'website',
    extraHead: '<link rel="alternate" type="application/rss+xml" title="Craig Dennis Blog" href="/blog/feed.xml" />',
    body: indexBody,
  });

  writePage(path.join(OUTPUT_DIR, 'index.html'), indexHtml);
  writePage(path.join(OUTPUT_DIR, 'feed.xml'), renderRss(posts));

  console.log(`Built ${posts.length} post(s)${drafts ? `, skipped ${drafts} draft(s)` : ''}.`);
}

if (process.argv.includes('--watch')) {
  build();
  fs.watch(CONTENT_DIR, { recursive: true }, () => {
    console.log('Content changed, rebuilding...');
    build();
  });
  console.log(`Watching ${CONTENT_DIR} for changes...`);
} else {
  build();
}
