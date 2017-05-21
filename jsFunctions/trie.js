
function Node(data, timePress, durationPressed) {
	this.data = data;
	this.isWord = false;
	this.timePress = timePress;
	this.durationPressed = durationPressed;
	this.prefixes = 0;
	this.children = {};
}

function Trie() {
	this.root = new Node('');
}

Trie.prototype.add = function(word, timeArrayPress, timeArrayDuration) {
	if(!this.root) {
		return null;
	}
	this._addNode(this.root, word, timeArrayPress, timeArrayDuration);
};
Trie.prototype._addNode = function(node, word, timeArrayPress, timeArrayDuration) {
	if(!node || !word) {
		return null;
	}
	node.prefixes++;
	var letter = word.charAt(0);
	var child = node.children[letter];
	var timePress = timeArrayPress.shift();
	var timeDuration= timeArrayDuration.shift();
	if(!child) {
		child = new Node(letter, timePress, timeDuration);
		node.children[letter] = child;
	}
	var remainder = word.substring(1);
	if(!remainder) {
		child.isWord = true;
	}
	this._addNode(child, remainder, timeArrayPress, timeArrayDuration);
};

Trie.prototype.remove = function(word) {
	if(!this.root) {
		return;
	}
	if(this.contains(word)) {
		this._removeNode(this.root, word);
	}
};
Trie.prototype._removeNode = function(node, word) {
	if(!node || !word) {
		return;
	}
	node.prefixes--;
	var letter = word.charAt(0);

	var child = node.children[letter];
	if(child) {
		var remainder = word.substring(1);
		if(remainder) {
			if(child.prefixes === 1) {
				delete node.children[letter];
			} else {
				this._removeNode(child, remainder);
			}
		} else {
			if(child.prefixes === 0) {
				delete node.children[letter];
			} else {
				child.isWord = false;
			}
		}
	}
};

Trie.prototype.contains = function(word) {
	if(!this.root) {
		return false;
	}
	return this.containsPartial(this.root, word);
};
Trie.prototype.update = function(word, press, duration) {
	console.log(press);
	if(!this.root) {
		return false;
	}
	press.reverse();
	duration.reverse();
	return this._update(this.root, word, press, duration);
};
Trie.prototype._contains = function(node, word) {
	if(!node || !word) {
		return false;
	}
	var letter = word.charAt(0);
	var child = node.children[letter];
	if(child) {
		var remainder = word.substring(1);
		if(!remainder && child.isWord) {
			return true;
		} else {
			return this._contains(child, remainder);
		}
	} else {
		return false;
	}
};
Trie.prototype.containsPartial = function(node, word) {
	if(!node) {
		return false;
	}
	if(word == " ") {
		return true;
	}
	var letter = word.charAt(0);
	var child = node.children[letter];
	if(child) {
		var remainder = word.substring(1);
		if(!remainder && child.isWord) {
			return true;
		} else {
			return this.containsPartial(child, remainder);
		}
	} else {
			return false;
	}
};
Trie.prototype._update = function(node, word, press, duration) {
	if(!node) {
		return false;
	}
	if(word == " ") {
		return true;
	}
	var letter = word.charAt(0);
	var child = node.children[letter];
	if(child) {
		child.timePress = (child.timePress + press.pop())/2;
		child.durationPressed = (child.durationPressed + duration.pop())/2;
		var remainder = word.substring(1);
		if(!remainder && child.isWord) {
			return true;
		} else {
			return this._update(child, remainder, press, duration);
		}
	} else {
		return false;
	}
};

Trie.prototype.countWords = function() {
	if(!this.root) {
		return console.log('No root node found');
	}
	var queue = [this.root];
	var counter = 0;
	while(queue.length) {
		var node = queue.shift();
		if(node.isWord) {
			counter++;
		}
		for(var child in node.children) {
			if(node.children.hasOwnProperty(child)) {
				queue.push(node.children[child]);
			}
		}
	}
	return counter;
};


Trie.prototype.getWords = function() {
	var words = [];
	var word = '';
	this._getWords(this.root, words, words, word);
	return words;
};
Trie.prototype._getWords = function(node, words, word) {
	for(var child in node.children) {
		if(node.children.hasOwnProperty(child)) {
			word += child;
			if (node.children[child].isWord) {
				words.push(word);
			}
			this._getWords(node.children[child], words, word);
			word = word.substring(0, word.length - 1);
		}
	}
};


Trie.prototype.print = function() {
	if(!this.root) {
		return console.log('No root node found');
	}
	var newline = new Node('|');
	var queue = [this.root, newline];
	var string = '';
	while(queue.length) {
		var node = queue.shift();
		string += node.data.toString() + ' ';
		if(node === newline && queue.length) {
			queue.push(newline);
		}
		for(var child in node.children) {
			if(node.children.hasOwnProperty(child)) {
				queue.push(node.children[child]);
			}
		}
	}
	console.log(string.slice(0, -2).trim());
};




Trie.prototype.printByLevel = function() {
	if(!this.root) {
		return console.log('No root node found');
	}
	var newline = new Node('\n');
	var queue = [this.root, newline];
	var string = '';
	while(queue.length) {
		var node = queue.shift();
		string += node.data.toString() + (node.timePress > 0 ? '(' + node.timePress + ', ' : '') + (node.durationPressed > 0 ? node.durationPressed + ')' : '') + (node.data !== '\n' ? ' ' : '');
		if(node === newline && queue.length) {
			queue.push(newline);
		}
		for(var child in node.children) {
			if(node.children.hasOwnProperty(child)) {
				queue.push(node.children[child]);
			}
		}
	}
	console.log(string.trim());
};


