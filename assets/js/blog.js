/* =====================================================
   BLOG LIST
   Reads blog/posts.json and builds the post cards on the
   home page ("Latest writing") and on the blog page.

   To publish a post you never edit this file:
   1. Copy blog/_template.html to blog/<your-slug>.html and write the post.
   2. Add an entry for it at the top of blog/posts.json.

   Cards are built with createElement and textContent, never
   innerHTML, so text from posts.json can't inject code.
===================================================== */

(function () {
  'use strict';

  var lists = document.querySelectorAll('[data-blog-list]');
  if (!lists.length) return;

  var SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  function isValidPost(post) {
    return post &&
      typeof post.slug === 'string' && SLUG_PATTERN.test(post.slug) &&
      typeof post.title === 'string' && post.title.trim() !== '' &&
      typeof post.date === 'string' && !isNaN(Date.parse(post.date));
  }

  function formatDate(isoDate) {
    return new Date(isoDate + 'T00:00:00').toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function buildCard(post) {
    var card = element('article', 'card post-card');

    var meta = formatDate(post.date);
    if (typeof post.minutes === 'number') meta += ' · ' + post.minutes + ' min read';
    card.appendChild(element('p', 'post-meta', meta));

    var heading = element('h3');
    var link = element('a', 'post-link', post.title);
    link.href = '/blog/' + post.slug;
    heading.appendChild(link);
    card.appendChild(heading);

    if (typeof post.summary === 'string') {
      card.appendChild(element('p', '', post.summary));
    }

    if (Array.isArray(post.tags) && post.tags.length) {
      var tags = element('ul', 'chip-list');
      post.tags.slice(0, 4).forEach(function (tag) {
        tags.appendChild(element('li', '', String(tag)));
      });
      card.appendChild(tags);
    }

    return card;
  }

  function render(posts) {
    posts = posts.filter(isValidPost).sort(function (a, b) {
      return Date.parse(b.date) - Date.parse(a.date);
    });

    lists.forEach(function (list) {
      var limit = parseInt(list.getAttribute('data-limit'), 10);
      var shown = limit > 0 ? posts.slice(0, limit) : posts;
      shown.forEach(function (post) {
        list.appendChild(buildCard(post));
      });
    });

    if (posts.length) {
      /* Reveal the Blog nav link and home page section. */
      document.querySelectorAll('[data-blog-only]').forEach(function (node) {
        node.hidden = false;
      });
    } else {
      document.querySelectorAll('[data-blog-empty]').forEach(function (node) {
        node.hidden = false;
      });
    }
  }

  fetch('/blog/posts.json', { cache: 'no-cache' })
    .then(function (response) {
      if (!response.ok) throw new Error('posts.json not found');
      return response.json();
    })
    .then(function (data) {
      render(Array.isArray(data) ? data : []);
    })
    .catch(function () {
      render([]);
    });
})();
