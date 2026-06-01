const bcrypt = require("bcryptjs");

(async () => {
  try {
    const hash = await bcrypt.hash("123456", 10);
    console.log("HASH:", hash);
  } catch (err) {
    console.error(err);
  }
})();