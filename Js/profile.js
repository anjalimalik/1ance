var email, pass, name, edu, skills, desc, contact, links, pic, docs;
var urlChangePass = "http://localhost:5500/changePassword"
var urlNotifications = "http://localhost:5500/getNotifications"
var urlGetProfile = "http://localhost:5500/getProfile"
var urlUpload = "http://localhost:5500/api/upload";
var numNotifs = 0;

function onLoad_profile() {

    optionsToggle.style.display = "none";
    notificationsToggle.style.display = "none";

    var url = window.location.href;
    var str = url.split("?email=");
    email = str[1];
    if (email === null) {
        alert("You have to be logged in first!");
        window.location.href = "index.html";
    }
    else if (email.includes("#")) {
        email = email.replace("#", "");
    }

    fetch(urlGetProfile, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "email": email
        })

    }).then(function (res) {
        console.log("Inside res function");
        if (res.ok) {
            res.json().then(function (data) {

                console.log(data.response);
                console.log("Inside res.ok");
                var json = data.response;
                name = json[0].FullName;
                edu = json[0].Education;
                links = json[0].Links;
                contact = json[0].ContactInfo;
                desc = json[0].Description;
                skills = json[0].SkillsSet;
                populate_profile();

            }.bind(this));
        }

        /*else {
            alert("Error: get profile unsuccessful!");
            res.json().then(function (data) {
                console.log(data.message);
            }.bind(this));
            return;
        }
    }).catch(function (err) {
        alert("Error: No internet connection!");
        console.log(err.message + ": No Internet Connection");
        return;
    });
    */
    var img = new Image();
    img.src = "./../css/Assets/spinner.jpg";
    document.getElementById("img_profile").src = "./../css/Assets/user_icon.jpg";
    var background = localStorage.getItem("style");
    document.body.style.backgroundColor = background;

}

function goToHome() {
    var u = 'home.html?email='.concat(email);
    window.location.href = u;
}

function displayOptions() {
    document.getElementById("notificationsToggle").style.display = "none";
    var x = document.getElementById("optionsToggle");

    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function displayNotifications() {
    document.getElementById("optionsToggle").style.display = "none";
    var x = document.getElementById("notificationsToggle");

    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

    // function to get notifications
    btn_getNotifications();
}

$(function () {
    $(":file").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });
});

function imageIsLoaded(e) {
    $('#img_profile').attr('src', e.target.result);
}

function populate_profile() {
    document.getElementById("profile_name").innerHTML = name;
    document.getElementById("profile_email").innerHTML = email;
    document.getElementById("profile_edu").innerHTML = edu;
    document.getElementById("profile_contact").innerHTML = contact;
    document.getElementById("profile_desc").innerHTML = desc;
    document.getElementById("profile_skills").innerHTML = skills;

    var finallink = "https://" + links;
    var webLink = "<a href='" + finallink + "' id=\"profile_links\" class=\"card-link\">Portfolio Link</a>"
    document.getElementById("profile_links").innerHTML = webLink;
}

function btn_EditProfile() {
    document.getElementById("in_profile_edit_email").value = email;
    document.getElementById("in_profile_edit_email").readOnly = true;
    edit_edu.value = edu;
    edit_links.value = links;
    edit_contact.value = contact;
    edit_desc.value = desc;
    edit_skills.value = skills;
}

function btn_finish_edit() {
    edu = edit_edu.value;
    links = edit_links.value;
    contact = edit_contact.value;
    desc = edit_desc.value;
    skills = edit_skills.value;

    populate_profile();
}

// "Passwords Match"
function passMatch() {
    $('.text.text-success').remove();
    $('.text.text-danger').remove();
    var currentPass = in_profile_currentPass.value;
    var newPass = in_profile_newPass.value;
    var confirmPass = in_profile_confirmPass.value;

    if (currentPass === confirmPass) {
        var same = document.createElement("div");
        same.setAttribute('class', 'text text-danger');
        same.innerHTML = "New password cannot be the same";
        document.getElementById("fieldset_passChange").appendChild(same);
    }
    else if (newPass != confirmPass) {
        var match = document.createElement("div");
        match.setAttribute('class', 'text text-danger');
        match.innerHTML = "Passwords do not match!";
        document.getElementById("fieldset_passChange").appendChild(match);
    }
    else if (newPass == confirmPass) {
        var match = document.createElement("div");
        match.setAttribute('class', 'text text-success');
        match.innerHTML = "Passwords match!";
        document.getElementById("fieldset_passChange").appendChild(match);
    }
}

// clear settings modal
function clearSetModal() {
    in_profile_currentPass.value = ""
    in_profile_newPass.value = "";
    in_profile_confirmPass.value = "";
    $('.text.text-success').remove();
    $('.text.text-danger').remove();
}

// Password change function
function btn_passChange() {
    var currentPass = in_profile_currentPass.value;
    var newPass = in_profile_newPass.value;
    var confirmPass = in_profile_confirmPass.value;

    if (newPass != confirmPass) {
        alert("New password verification failed!");
        clearSetModal();
        return;
    }
    if (currentPass === null || currentPass === "") {
        alert("Current Password needs to be provided");
        clearSetModal();
        return;
    }
    else if (currentPass === newPass) {
        alert("New Password cannot be the same");
        clearSetModal();
        return;
    }
    if (newPass === null || newPass === "" || confirmPass === null || confirmPass === "") {
        alert("New password cannot be empty");
        clearSetModal();
        return;
    }

    fetch(urlChangePass, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "email": email,
            "oldPass": currentPass,
            "newPass": newPass
        })

    }).then(function (res) {
        console.log("Inside res function");
        if (res.ok) {
            res.json().then(function (data) {
                alert(data.message);
                console.log("Inside res.ok");
            }.bind(this));
        }
        else {
            alert("Error: Change password unsuccessful!");
            res.json().then(function (data) {
                console.log(data.message);
            }.bind(this));
        }
    }).catch(function (err) {
        alert("Error: No internet connection!");
        console.log(err.message + ": No Internet Connection");
    });
    clearSetModal();
}


function btn_getNotifications() {

    console.log(email);
    fetch(urlNotifications, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            "email": email
        })

    }).then(function (res) {
        console.log("Inside res function");
        if (res.ok) {
            res.json().then(function (data) {
                console.log(data.message);
                console.log(data.response);
                console.log("Inside res.ok, Get Notifications successful!");
                var length = Object.keys(data.response).length;
                if (length != 0 && numNotifs < length) {
                    numNotifs = 0;
                    var json = data.response;
                    for (i = 0; i < length; i++) {
                        var ul = document.createElement("a");
                        ul.setAttribute('class', 'notifClass dropdown-item');
                        ul.innerHTML = (json[i].Notification).toString();
                        ul.style = "border-bottom: 1px solid #ccc; margin-left:-40px;color:#333399;";
                        document.getElementById("notif").appendChild(ul);
                        numNotifs++;
                    }
                }
                else if (numNotifs == 0) {
                    numNotifs--;
                    var ul = document.createElement("a");
                    ul.setAttribute('class', 'notifClass dropdown-item');
                    ul.innerHTML = "No notifications available for you at this time.";
                    ul.style = "border-bottom: 1px solid #ccc;";
                    document.getElementById("notif").appendChild(ul);
                }
            }.bind(this));
        }
        else {
            alert("Error: Get notifications unsuccessful!");
            res.json().then(function (data) {
                console.log(data.message);
            }.bind(this));
        }
    }).catch(function (err) {
        alert("Error: No internet connection!");
        console.log(err.message + ": No Internet Connection");
    });

}

function uploadPicture() {

    var input = document.querySelector('input[type="file"]')
    var data = new FormData()
    data.append('file', input.files[0])
    //data.append('user', 'hubot')

    fetch(urlUpload, {
        method: 'POST',
        body: ({'element2': data})
    }).then(function (res) {
        console.log("Inside res function");
        alert("Image Uploaded");
    }).catch(function (err) {
        alert("Error: No internet connection!");
        console.log(err.message + ": No Internet Connection");
    });
}

function btn_theme_1() {
    var theme = "Tomato";
    document.body.style.backgroundColor = theme;
    localStorage.setItem('style', theme);
    location.reload();
}
function btn_theme_2() {
    var theme = "Orange";
    document.body.style.backgroundColor = theme;
    localStorage.setItem('style', theme);
    location.reload();
}
function btn_theme_3() {
    var theme = "DodgerBlue";
    document.body.style.backgroundColor = theme;
    localStorage.setItem('style', theme);
    location.reload();
}
function btn_theme_4() {
    var theme = "Gray"
    localStorage.setItem('style', theme);
    document.body.style.backgroundColor = theme;
    location.reload();
    
}


function deleteAccount() {
        var str = name.concat(", confirm your password below to remove 1ance account");
        document.getElementById("accountName").innerHTML = str;
        document.getElementById("accountName").setAttribute("style", "font-size:120%; color:red;");
        document.getElementById("accountEmail").value = email;
        document.getElementById("accountEmail").readOnly = true;
        document.getElementById("accountEmail").setAttribute("style", "background-color: #D3D3D3;");
}
