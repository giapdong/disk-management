
const fs = require('fs');
const path = require('path');
const rootPath = path.join(__dirname, '../..');


const Analyzer: Array<any> = [];
import * as helper from '../helper/global-helper';
import DiskFileSystem from '../tools/DiskFileSystem';

const MAX_LEVEL = 5;
const KEYWORDS = [
	"$Recycle.Bin",
	"$$0|node_modules", "$$0|package.json", "$$0|.git", "$$0|composer.json",
	"C:\\Windows|$$1", "C:\\xampp|$$1",
	"Program Files|$$1", "C:\\ProgramData|$$1",
	"C:\\Users\\admin\\AppData$$$Local$$$Docker$$$wsl"
];


var chunker = new (Chunker as any)(KEYWORDS);

function walk(node: any, level: number) {

	if (level >= MAX_LEVEL && !node.keep) {
		return Analyzer.push(omit(node));
	}

	if (chunker.check(node)) {
		return Analyzer.push(omit(node));
	}

	for (var i = 0; i < node.child.length; i++) {
		var child = node.child[i];
		child.keep = node.keep;
		walk(child, level + 1);
	}
}

function omit(node: any) {

	var keys = Object.keys(node).filter(item => item != "child");
	var clone: any = {};
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		clone[key] = node[key];
	}

	return clone;
};


function Chunker(keywords: Array<string>) {

	this.$stopwords = [];
	this.$poststop = [];
	this.$prestop = [];
	this.$rules = [];

	for (var i = 0; i < keywords.length; i++) {
		var word = keywords[i];
		var match = null;

		// "$$0|node_modules"
		if (word.match(/^\$\$0\|/)) {
			var chunk = word.replace(/^\$\$0\|/, '');
			this.$poststop.push(chunk);
			continue;
		}

		// "Program Files|$$1"
		if (word.match(/\|\$\$1$/)) {
			var chunk = word.replace(/\|\$\$1$/, '');
			this.$prestop.push(chunk);
			continue;
		}

		// "C:\\Users\\admin$$$AppData$$$Local"
		// if (match = word.match(/([\w\s-\$\(\)\{\}\\\/\:\.]+)\$\$\$([\w]+)/)) {
		if (match = word.match(/\$\$\$/)) {
			var parts = word.split("$$$");
			var rule = {
				name: parts.shift(),
				children: parts,
			};
			this.$rules.push(rule);
			continue;
		}

		this.$stopwords.push(word);
	}


	/**
	 * @desc Check node is match with pattern or not
	 * @refactor When write this function i aware that will must refactor it but not now. Now it crude!
	 * @param {object} node 
	 * @returns 
	 */
	this.check = function(node: any) {

		if (!node || !node.name) return null;

		// Match with keyword
		for (var i = 0; i < this.$stopwords.length; i++) {
			if (node.name.includes(this.$stopwords[i])) {
				return true;
			}
		}

		// Match if child match
		for (var i = 0; i < node.child.length; i++) {
			var child = node.child[i];

			for (var j = 0; j < this.$poststop.length; j++) {
				if(this.postMatch(child.name, this.$poststop[j])) return true;
			}
		}

		// Match if parent match - parent still includes in path-name
		for (var i = 0; i < this.$prestop.length; i++) {
			if (this.postMatch(node.name, this.$prestop[i])) return false;

			if (node.name.includes(this.$prestop[i])) {
				return true;
			}
		}

		// Match if name match both rule name and child parts
		for (var i = 0; i < this.$rules.length; i++) {
			var rule = this.$rules[i];

			if (this.postMatch(node.name, rule.name)) {
				node.keep = true;
				return false;
			}

			if (node.name.includes(rule.name)) {

				var child_name = rule.name;
				for (var k = 0; k < rule.children.length; k++) {
					var child_name = path.join(child_name, rule.children[k]);

					if (this.postMatch(node.name, child_name)) return false;
				}

				return true;
			}
		}

		return false;
	}


	this.postMatch = function(original: string, pattern: string) {

		var regex = new RegExp(escape(pattern) + "$");
		if (original.match(regex)) return true;

		return false;
	}
};


// https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escape(str: string) {

	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

	var parts = str.split('');
	var clone = '';
	for (var i = 0; i < parts.length; i++) {
		if (parts[i] && parts[i].match(/[\$\(\)\{\}\\\/\:\.]/)) {
			clone += '';
		}

		clone += parts[i];
	}

	return clone;
}


export default class DiskAnalyzer {

	static async run(filepath: string) {

		if (filepath.match(/xjson$/)) {
			let txt = await DiskFileSystem.extractFile(filepath);
			var file = JSON.parse(txt.toString());
		} else {
			// const file = require('../scan/2023-09-07_17.23.07.sys4.json');
			var file = require(filepath);
		}

		const Hierachy = file.root;

		Analyzer.push(omit(Hierachy));

		walk(Hierachy, 1);
		delete file.root;

		let template = fs.readFileSync(path.join(rootPath, "static/disk.template.html"), "utf8");
		var html = '';
		for (var i = 0; i < Analyzer.length; i++) {
			var node = Analyzer[i];

			if (node.storage < 1024) continue; // Ignore file < 1KB

			var node_name = node.name;
			if (node_name.length > 80) {
				node_name = node.name.substring(0, 80) + "...";
			}

			html += `
				<tr>
					<td title='${node.name}'>${node_name}</td>
					<td>${node.storage.toLocaleString('en-US')}</td>
					<td>${helper.bytesToSize(node.storage)}</td>
				</tr>
			`;
		}

		html = `
		<table>
			<thead>
				<th class='folder'>Folder</th>
				<th class='size'>Size (Bytes)</th>
				<th class='hsize'>Human Size</th>
			</thead>

			<tbody>
				${html}
			</tbody>
		</table>
		`;

		template = template.replace("{{content}}", html);

		var today = new Date().toISOString().replace(/:/g, '.').substring(0, 10);
		var targetFilePath = path.join(rootPath, '../compare', `index-${today}.html`);
		var targetfilepath = await DiskFileSystem.generateSafeFilePath(targetFilePath);
		fs.writeFileSync(targetfilepath, template, {flag: "as+", encoding: "utf8"});

		console.log('See analyze file here: ', targetFilePath);
	};
};