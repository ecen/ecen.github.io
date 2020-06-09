---
title: Blog
author_profile: true
permalink: /blog/
header:
    image: "/assets/images/new-zealand-lake-mountains-road-5-w1920px-q80.jpg"
---

<div class="blog-list win-wide-3">
   {% for post in site.posts%}
      <div class="window win-wide-2">
         {% include blog-preview.html %}
      </div>
   {% endfor %}
</div>
