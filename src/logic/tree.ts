import { google10000 } from "./google-10000";

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

export class TreeNode {
  public count: number;
  public children: TreeNode[];
  public letter: string;

  constructor(
    word: string,
    public parent?: TreeNode
  ) {
    this.count = 1;
    if (word.length === 0) {
      this.children = [];
      this.letter = '0';
    } else {
      this.children = [new TreeNode(word.substring(1), this)];
      this.letter = word[0];
    }
  }

  addChild(word: string) {
    this.count++;
    let found = false;
    if (word.length === 0) {
      this.children.push(new TreeNode('', this))
    }
    this.children.forEach(child => {
      if (child.letter === word[0]) {
        child.addChild(word.substring(1));
        found = true;
      }
    });
    if (!found) {
      this.children.push(new TreeNode(word, this));
    }
  }

  maxLength() {
    let d = -1;
    let n = -1;
    this.children.forEach((child) => {
      n = child.maxLength();
      if (n > d) {
        d = n;
      }
    })
    return d + 1;
  }

  fullString(): string {
    return (this.parent?.fullString() || '') + this.letter;
  }

  static default() {
    const words = google10000.split(/\r?\n/);
    return this.fromArray(words);
  }

  static fromFile(callback: (_: Map<string, TreeNode>) => void) {
    const file = document.createElement('input');
    file.type = 'file';
    file.click();
    file.addEventListener('change', e => {
      if (e) {
        const input = e.target as HTMLInputElement;
        if (input.files) {
          const fr = new FileReader();
          fr.onload = () => {
            const words = fr.result?.toString().split(/\r?\n/);
            if (words && words.length > 0) {
              callback(this.fromArray(words));
            }
          }
          fr.readAsText(input.files[0]);
        }
      }
    })
  }

  static fromArray(words: string[]) {
    const trees: Map<string, TreeNode> = new Map();
    const fixedWords = this.alphabetize(words.map((w) => w.toLowerCase()));
    fixedWords.forEach(word => {
      if (trees.has(word[0])) {
        trees.get(word[0])?.addChild(word.substring(1));
      } else if (word[0]) {
        trees.set(word[0], new TreeNode(word));
      }
    })
    return trees;
  }

  static alphabetize(words: string[]) {
    let maxLength = 0;
    for (let word of words) {
      let l = word.length;
      if (l > maxLength) {
        maxLength = l;
      }
    }
    for (let i = 0; i < maxLength; i++) {
      const buckets = new Array(27).fill(0).map(_ => new Array(0));
      for (let j of words) {
        const letter = j[maxLength - i - 1];
        if (letter) {
          buckets[alphabet.indexOf(letter) + 1].push(j);
        } else {
          buckets[0].push(j);
        }
      }
      let index = 0;
      for (let j of buckets) {
        for (let k of j) {
          if (k != '') {
            words[index] = k;
            index++;
          }
        }
      }
    }
    return words;
  }

}