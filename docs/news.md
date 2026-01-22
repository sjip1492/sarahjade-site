---
layout: content-post
title: News
url: news
---
{% assign news = site.posts | where:"tags","news"  %}
{% for post in news limit:10 %}
  <div class="blog-preview">
    <p><b><a href="{{ post.url }}">{{ post.date | date: "%-d %B %Y" }}</a></b> {{ post.title }}</p>
  </div>
{% endfor %}
<p><a href="{{ '/news_index.html' | relative_url }}" target="_self">See all news -></a></p>