void((function(list){list.map(src=>{var e=document.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src',src);document.head.appendChild(e)})})(['//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js?','//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.2/lodash.min.js', '//cdnjs.cloudflare.com/ajax/libs/bluebird/3.4.6/bluebird.min.js']));

document.write('<div id="working">Working.... Just hold on</div>');

setTimeout(() => {
  $('#working').remove();

  $.extend({
     jpost: function(url, body) {
         return $.ajax({
             type: 'POST',
             url: url,
             data: JSON.stringify(body),
             contentType: "application/json",
             dataType: 'json'
         });
     }
  });

  $(document).on('submit', 'form#login', function formLogin(e) {
      e.preventDefault();
      login($('#email').val(), $('#password').val())
          .then(a => alert('done'))
          .catch(e => alert(e.responseText));
  });

  $(document).on('submit', 'form#link', function formLogin(e) {
      e.preventDefault();
      var links = _.compact( $('#links').val().split('\n'));
      Promise.map(links, l => link(l)).then(printLinks);
  });

  $(document.body).append(
      `<form id="login">
          <div>
              <input id="email" type="email" placeholder="email">
          </div>
          <div>
              <input id="password" type="password" placeholder="password">
          </div>
          <div>
              <input type="submit" value="Login">
          </div>
      </form>
      <br>
      <div>
          <form id="link">
              <div>Fshare Links:</div>
              <textarea id="links" style="margin: 0px;width: 733px;height: 213px;" ></textarea>
              <div>
                <input type="submit">
              </div>
          </form>
      </div>

      <div>
          <label>Direct links:</label>
          <div id="output"></div>
      </div>
      <div>
          <div>Raw:</div>
          <textarea id="raw" style="margin: 0px;width: 733px;height: 213px;background: #efefef;" readonly></textarea>
      </div>`
  );
}, 1500);

function login(email, password) {
    return Promise.resolve($.jpost('/api/user/login', {
       app_key: 'L2S7R6ZMagggC5wWkQhX2+aDi467PPuftWUMRFS', user_email: email, password: password
    }).then(r => {
       return $.__token = r.token;
    }));
}

function link(url) {
   return Promise.resolve($.jpost('api/session/download', { url: url, token: $.__token })).then(a => a.location);
}

function printLinks(links) {
    var $output = $('#output');
    $output.empty().append(links.map(l => {
      let text = _.last(decodeURIComponent(l).split('/'));
      return `<a href="${l}">${text}</a>`;
    }).join('<br/>'));

    $('#raw').val(links.join('\n'));
}
