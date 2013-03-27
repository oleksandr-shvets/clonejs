<?php
function include_markdown($filename){
    $html = `../../node_modules/.bin/md2html $filename`;
    echo preg_replace( '|&lt;!--- HIDDEN: --&gt;(.*)&lt;!--- /HIDDEN --&gt;|msU', '', $html);
}
?><!DOCTYPE html>
<html>

  <head>
    <meta charset='utf-8' />
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <meta name="description" content="Clonejs : The true prototype-based JavaScript micro-framework." />

    <link rel="stylesheet" type="text/css" media="screen" href="stylesheets/stylesheet.css">

    <title>Clonejs</title>
  </head>

  <body>

    <!-- HEADER -->
    <div id="header_wrap" class="outer">
        <header class="inner">
          <a id="forkme_banner" href="https://github.com/quadroid/clonejs">View on GitHub</a>

          <h1 id="project_title">Clonejs</h1>
          <h2 id="project_tagline">The true prototype-based JavaScript micro-framework.</h2>

            <section id="downloads">
              <a class="zip_download_link" href="https://github.com/quadroid/clonejs/zipball/master">Download this project as a .zip file</a>
              <a class="tar_download_link" href="https://github.com/quadroid/clonejs/tarball/master">Download this project as a tar.gz file</a>
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

<?php include '.analytics-code.html' ?>

  </body>
</html>