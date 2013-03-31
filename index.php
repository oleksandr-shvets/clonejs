<?php
function include_markdown($filename){
    $html = `../../node_modules/.bin/md2html $filename`;
    $substitutions = array(
        '#&lt;!-- HIDDEN: --&gt;(.*)&lt;!-- /HIDDEN --&gt;#msU' => '',
        '#http://clonejs\.org/(?![ \'"])#' => './',
        '#\shref\s.=\s.["\']https?://#' => ' target="_blank"$0',
        //'#<a href = "" >⠙</a>#' => '',
    );
    echo preg_replace( array_keys($substitutions), array_values($substitutions), $html);
}
?><!DOCTYPE html>
<html>

  <head>
    <title>clone.js</title>
    
    <meta charset='utf-8' />
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <meta name="description" content="Clonejs : The true prototype-based JavaScript micro-framework." />
    
    <link rel="stylesheet" href="http://yandex.st/highlightjs/7.3/styles/tomorrow.min.css">
    <script src="http://yandex.st/highlightjs/7.3/highlight.min.js"></script>
    
    <link rel="stylesheet" type="text/css" media="screen" href="stylesheets/stylesheet.css">
    <style>
        NAV {
            color: rgb(128, 128, 128);
            position: absolute;
            z-index: 11;
        }
        NAV A {color: white}
        NAV A:hover {color:#007edf}
        #downloads{
            width: 603px;
            background-position-x: 400px;
        }
        #downloads .version{
            float: right;
            color: grey;
            font-style: italic;
            margin-top: 40px;
            margin-right: 15px;
        }
        #main_content IMG {width: auto; height: auto}
        #main_content H2 IMG {float: right}
        #main_content PRE CODE {padding: 0px}
    </style>
  </head>

  <body onload="hljs.initHighlighting()">

    <!-- HEADER -->
    <div id="header_wrap" class="outer">
        <header class="inner">
          <a id="forkme_banner" href="https://github.com/quadroid/clonejs">View on GitHub</a>

          <h1 id="project_title">Clonejs</h1>
          <h2 id="project_tagline">The true prototype-based JavaScript micro-framework.</h2>
          
            <nav>[
                  <a href="./symbols/%24object.html">API documentation</a>
                | <a href="http://github.com/quadroid/clonejs">GitHub</a>
                | <a href="http://npmjs.org/package/clonejs">NPM package</a>
                | <a href="http://travis-ci.org/quadroid/clonejs">Travis CI</a>
            ]</nav>

            <section id="downloads">
              <a class="zip_download_link" href="https://github.com/quadroid/clonejs/zipball/master">Download this project as a .zip file</a>
              <a class="tar_download_link" href="https://github.com/quadroid/clonejs/tarball/master">Download this project as a tar.gz file</a>
              <span class="version">
                 <?php include "../../.version" ?>
              </span>
            </section>
        </header>
    </div>

    <!-- MAIN CONTENT -->
    <div id="main_content_wrap" class="outer">
      <section id="main_content" class="inner">

<?php include_markdown('../../README.md') ?>
          
      </section>
    </div>

    <!-- FOOTER  -->
    <div id="footer_wrap" class="outer">
      <footer class="inner">
        <p class="copyright">Clonejs maintained by <a href="https://github.com/quadroid">Alex Shvets</a></p>
        <p>Published with <a href="http://pages.github.com">GitHub Pages</a></p>
      </footer>
    </div>

  </body>

  <?php include '.analytics-code.html' ?>
  
</html>