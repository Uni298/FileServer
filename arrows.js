module.exports = {
  name: "Arrows",
  version: "1.0",
  description: "矢印記法を変換",
  transform(text) {
    return text
      .replace(/=>/g, '⇒')
      .replace(/->/g, '→')
      .replace(/<-/g, '←')
      .replace(/<=/g, '⟸')
      .replace(/<->/g, '↔');
  }
};
