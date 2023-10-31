// https://github.com/secretGeek/html_wysiwyg/
// Similar: https://mrcoles.com/demo/markdown-css/

document.head.insertAdjacentHTML(
  "beforeend",
  `/* https://secretgeek.github.io/html_wysiwyg/html.html */<style>
html::before {content:'<html>'}
html::after {content:'</html>'}
head::before {content:'<head>'}
head::after {content:'</head>'}
title::before {content:'<title>'}
title::after {content:'</title>'}
body::before {content:'<body>'}
body::after {content:'</body>'}
h1::before {content:'<h1>'}
h1::after {content:'</h1>'}
h2::before {content:'<h2>'}
h2::after {content:'</h2>'}
p::before {content:'<p>'}
p::after {content:'</p>'}
pre::before {content:'<pre>'}
pre::after {content:'</pre>'}
code::before {content:'<code>'}
code::after {content:'</code>'}
a::before {content:'<a>'}
a::after {content:'</a>'}
aside::before {content:'<aside>'}
aside::after {content:'</aside>'}
blockquote::before {content:'<blockquote>'}
blockquote::after {content:'</blockquote>'}
em::before {content:'<em>'}
em::after {content:'</em>'}
strong::before {content:'<strong>'}
strong::after {content:'</strong>'}
style::before {content:'<style>'}
style::after {content:'<\\/style>'}

*::before,*::after {
  color:rgba(136, 18, 128, 0.5);
  font-weight:100;
  font-size:1.0em
}

html {
  max-width:70ch;
  padding:2ch;
  margin:auto;
  color:#333;
  font-size:1.2em;
}
</style>`
);
