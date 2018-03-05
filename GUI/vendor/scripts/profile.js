
var email, pass, name, edu, skills, desc, contact, links, pic, docs;

function body_onload() {
    name = localStorage.getItem('name');
    email = localStorage.getItem('email');
    edu = localStorage.getItem('edu');
    links = localStorage.getItem('links');
    contact = localStorage.getItem('contact');
    desc = localStorage.getItem('desc');
    skills = localStorage.getItem('skills');

    populate_profile();
}

function populate_profile () {
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

function btn_edit() {
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