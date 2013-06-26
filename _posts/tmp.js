
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{{ page.title }}</title>
    {% if page.description %}<meta name="description" content="{{ page.description }}">{% endif %}
    <meta name="author" content="{{ site.author.name }}">

    <!-- Enable responsive viewport -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Le HTML5 shim, for IE6-8 support of HTML elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le styles -->
    <link href="{{ ASSET_PATH }}/css/pure-min.css" rel="stylesheet">
    <link href="{{ ASSET_PATH }}/css/typo.css" rel="stylesheet" type="text/css" media="all">
    <link href="{{ ASSET_PATH }}/css/styles.css" rel="stylesheet">
    <link href="{{ ASSET_PATH }}/css/markdown.css" rel="stylesheet">
    <script src="{{ ASSET_PATH }}/js/main.js"></script>
    <style type="text/css">.demo-unit,.tk-proxima-nova,body,h2,h3{font-family:"proxima-nova",sans-serif;}.header h1,.hero h1,.hero h2,.tk-omnes-pro{font-family:"omnes-pro",sans-serif;}</style><link rel="stylesheet" href="typo.css"><script>
        try { Typekit.load(); } catch (e) {}
    </script>
    
    <!-- Le fav and touch icons -->
  <!-- Update these with your own images
    <link rel="shortcut icon" href="images/favicon.ico">
    <link rel="apple-touch-icon" href="images/apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="72x72" href="images/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="114x114" href="images/apple-touch-icon-114x114.png">
  -->

    <!-- atom & rss feed -->
    <link href="{{ BASE_PATH }}{{ site.JB.atom_path }}" type="application/atom+xml" rel="alternate" title="Sitewide ATOM Feed">
    <link href="{{ BASE_PATH }}{{ site.JB.rss_path }}" type="application/rss+xml" rel="alternate" title="Sitewide RSS Feed">

  </head>

  <body>
    <div class="pure-g-r content" id="layout">
      <div class="pure-u" id="nav">
        <div class="nav-inner">
          <a href="{{ HOME_PATH }}" class="pure-button primary-button">{{ site.title }}</a>
          <div class="pure-menu pure-menu-open">
            <ul>                
              {% assign posts_collate = site.posts %}

            </ul>
          </div>
        </div>
      </div>

      <div class="pure-u list" id="archive-list">
        <div class="content">

        {% for post in site.posts %}
        <div class="blog-titles pure-g" data-href="{{ post.url }}">
          <div class="pure-u-1-4">
            <div class="date">
              <div class="month">
                <p>{{ post.date | date: "%b" }}</p>
              </div>
              <div class="day">
                <p>{{ post.date | date: "%e"}}</p>
              </div>
            </div>
          </div> <!-- end pure-u-1-4 -->
      
          <div class="pure-u-3-4">
            <h4 class="blog-subject">{{ post.title }}</h4>
            <p class="blog-desc">This is just a description</p>
          </div>
        </div>
        <!--
          <li><span>{{ post.date | date: "%B %e, %Y" }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
        -->
        {% if forloop.last %}
        </div>
        {% endif %}
        {% endfor %}
      </div>
      {{ content }}

    </div>


    {% include JB/analytics %}
  </body>
</html>
