window.addEventListener('error', function(e) {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.left = '0';
  div.style.zIndex = '999999';
  div.style.backgroundColor = 'red';
  div.style.color = 'white';
  div.style.padding = '10px';
  div.innerHTML = e.message + '<br>' + e.filename + ':' + e.lineno;
  document.body.appendChild(div);
});
