"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const rootPath = path.join(__dirname, '../..');
const Analyzer = [];
const helper = __importStar(require("../helper/global-helper"));
const DiskFileSystem_1 = __importDefault(require("../tools/DiskFileSystem"));
const MAX_LEVEL = 5;
const KEYWORDS = [
    "$Recycle.Bin",
    "$$0|node_modules", "$$0|package.json", "$$0|.git", "$$0|composer.json",
    "C:\\Windows|$$1", "C:\\xampp|$$1",
    "Program Files|$$1", "C:\\ProgramData|$$1",
    "C:\\Users\\admin\\AppData$$$Local$$$Docker$$$wsl"
];
var chunker = new Chunker(KEYWORDS);
function walk(node, level) {
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
function omit(node) {
    var keys = Object.keys(node).filter(item => item != "child");
    var clone = {};
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        clone[key] = node[key];
    }
    return clone;
}
;
function Chunker(keywords) {
    this.$stopwords = [];
    this.$poststop = [];
    this.$prestop = [];
    this.$rules = [];
    for (var i = 0; i < keywords.length; i++) {
        var word = keywords[i];
        var match = null;
        if (word.match(/^\$\$0\|/)) {
            var chunk = word.replace(/^\$\$0\|/, '');
            this.$poststop.push(chunk);
            continue;
        }
        if (word.match(/\|\$\$1$/)) {
            var chunk = word.replace(/\|\$\$1$/, '');
            this.$prestop.push(chunk);
            continue;
        }
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
    this.check = function (node) {
        if (!node || !node.name)
            return null;
        for (var i = 0; i < this.$stopwords.length; i++) {
            if (node.name.includes(this.$stopwords[i])) {
                return true;
            }
        }
        for (var i = 0; i < node.child.length; i++) {
            var child = node.child[i];
            for (var j = 0; j < this.$poststop.length; j++) {
                if (this.postMatch(child.name, this.$poststop[j]))
                    return true;
            }
        }
        for (var i = 0; i < this.$prestop.length; i++) {
            if (this.postMatch(node.name, this.$prestop[i]))
                return false;
            if (node.name.includes(this.$prestop[i])) {
                return true;
            }
        }
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
                    if (this.postMatch(node.name, child_name))
                        return false;
                }
                return true;
            }
        }
        return false;
    };
    this.postMatch = function (original, pattern) {
        var regex = new RegExp(escape(pattern) + "$");
        if (original.match(regex))
            return true;
        return false;
    };
}
;
function escape(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
class DiskAnalyzer {
    static async run(filepath) {
        if (filepath.match(/xjson$/)) {
            let txt = await DiskFileSystem_1.default.extractFile(filepath);
            var file = JSON.parse(txt.toString());
        }
        else {
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
            if (node.storage < 1024)
                continue;
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
        var targetfilepathSafe = await DiskFileSystem_1.default.generateSafeFilePath(targetFilePath);
        fs.writeFileSync(targetfilepathSafe, template, { flag: "as+", encoding: "utf8" });
        console.log('See analyze file here: ', targetfilepathSafe);
    }
    ;
}
exports.default = DiskAnalyzer;
;
