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

function toggleVisible(name)
{
	let classList = document.getElementById(name).classList
	if (classList.contains("invisible"))
	{
		classList.add("visible");
		classList.remove("invisible");
	}
	else
	{
		classList.add("invisible");
		classList.remove("visible");
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
	let match = body.match(/(\S+)(?:<span class="nav-header-hashtag">)(#\d+)/g);
	for (str in match)
		match[str] = match[str].replace(/<.+>/, '');
	return match.sort();
}

const forum_url = cors_url + "https://atelier801.com/staff-ajax?role=";
async function extract_forum_data()
{
	for (name in forum_roles)
		await fetch(forum_url + forum_roles[name])
			.then(body => body.text())
			.then(body => extract_forum_nicknames(body))
			.then(body => generate_html(body, name))
}

// GitHub
let github_roles = {
	"Module Team": "mt",
	"Funcorp": "fc",
	"Fashion Squad": "fs"
}

function extract_github_nicknames(body, name)
{
	let list = body.match(`${name} = {[^}]+}`);
	return list[0].match(/\w+#\d+/g);
}

const github_url = cors_url + "https://github.com/a801-luadev/bolodefchoco/raw/master/module.lua";
async function extract_github_data()
{
	await fetch(github_url)
		.then(body => body.text())
		.then(body => {
			for (name in github_roles)
				generate_html(extract_github_nicknames(body, github_roles[name]), name);
		})
}

// Build
const html_init = `
	<div class=\"list\" class=\"visible\">
		<h3 onclick="toggleVisible('{0}');">{0}</h3>
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

function generate_html(body, name) { }