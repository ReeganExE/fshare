
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
    $output.empty().append(links.map(l => `<a href="${l}">${l}</a>`).join('<br/>'));
}

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
            <input id="password" type="password" placeholder="hihi">
        </div>
        <div>
            <input type="submit" value="log">
        </div>
    </form>
    <br>
    <div>
        <form id="link">
            <textarea id="links"></textarea>
            <input type="submit">
        </form>
    </div>

    <div>
        <label>Direct links:</label>
        <div id="output"></div>
    </div>`
);
