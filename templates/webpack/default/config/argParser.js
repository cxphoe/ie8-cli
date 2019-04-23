class ArgParser {
  static getEnvArgs() {
    return process.env || {};
  }

  static parseOptions() {
    const result = {};
    const argPattern = /^--(.+)=(.+)$/;
    for (const arg of process.argv) {
      const match = argPattern.exec(arg);
      if (match) {
        result[match[1]] = match[2];
      }
    }
    return result;
  }

  static getOptionArgs() {
    this.optionArgs = this.optionArgs || this.parseOptions();
    return this.optionArgs;
  }
}

ArgParser.optionArgs = null;

module.exports = ArgParser;
