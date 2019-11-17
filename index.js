// Utils
if (!String.format) {
	String.format = function(format) {
		var args = Array.prototype.slice.call(arguments, 1);
		return format.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != "undefined" ? args[number] : match;
		});
	};
}

let toggleVisible = function(name)
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