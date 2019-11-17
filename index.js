// Utils
if (!String.format) {
	String.format = function(format) {
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != "undefined" ? args[number] : match;
		});
	};
}
const cors_url = "https://cors-anywhere.herokuapp.com/";

function toggle_visibility(name)
{
	let classList = document.getElementById(name).classList
	if (classList.contains("invisible-hide"))
	{
		classList.remove("invisible-animate");
		classList.remove("invisible-hide");
	}
	else
	{
		classList.add("invisible-animate");
		setTimeout(function() {
			classList.add("invisible-hide");
		}, 1000);
	}
}

// Forum
let forum_roles = {
	"Administrators" : 128,
	"Moderators"     : 1,
	"Sentinels"      : 4,
	"Mapcrew"        : 16
}

function extract_forum_nicknames(body)
{
	return [...body.matchAll(/(\S+)<span class="nav-header-hashtag">#(\d+)/g)].sort();
}

const forum_url = cors_url + "https://atelier801.com/staff-ajax?role=";
function extract_forum_data()
{
	for (let name in forum_roles){
		fetch(forum_url + forum_roles[name])
			.then(body => body.text())
			.then(body => extract_forum_nicknames(body))
			.then(body => generate_html(body, name))
	}
}

// GitHub
let github_roles = {
	"Module Team":   "mt",
	"Funcorp":       "fc",
	"Fashion Squad": "fs"
}

function extract_github_nicknames(body, name)
{
	let list = body.match(`${name} = {[^}]+}`);
	return [...list[0].matchAll(/(\w+)#(\d+)/g)];
}

const github_url = cors_url + "https://github.com/a801-luadev/bolodefchoco/raw/master/module.lua";
function extract_github_data()
{
	fetch(github_url)
		.then(body => body.text())
		.then(body => {
			for (let name in github_roles)
				generate_html(extract_github_nicknames(body, github_roles[name]), name);
		})
}

// Build
const html_init = `
	<div class=\"list\" class=\"visible\">
		<h3 onclick="toggle_visibility('{0}');"><font type=\"{0}\">{0}</font></h3>
		<div id=\"{0}\">
			<table>
				<tr class=\"head\">
					<th>Nickname</th>
				</tr>`;
const html_cell = `
				<tr class=\"{0}-background\">
					<td><a href=\"https://atelier801.com/profile?pr={2}%23{3}\" target="_blank"><font type=\"{1}\">{2}</font><font type=\"small\">#{3}</font></a></td>
				</tr>`;
const html_end = `
			</table>
		</div>
	</div>`;

function generate_html(staff_list, name)
{
	let html = String.format(html_init, name);
	let color_index = 0;

	for (let index in staff_list)
	{
		html += String.format(html_cell,
			(++color_index % 2 == 0 ? "even" : "odd"),
			name,
			staff_list[index][1],
			staff_list[index][2]
		);
	}

	// Effect of "loading" in the site, instead of loading everything at once.
	html += html_end;

	let tmp = document.getElementById("tmp-" + name);
	tmp.insertAdjacentHTML("afterend", html);
	tmp.remove();
}

// Init
const html_tmp_div = "<div id=\"tmp-{0}\"></div>"
function place_lists()
{
	let html = '';
	for (let team of Object.keys(forum_roles).concat(Object.keys(github_roles)))
		html += String.format(html_tmp_div, team);
	document.getElementById("lists").innerHTML += html;
}

function init()
{
	place_lists();
	extract_forum_data();
	extract_github_data();
}