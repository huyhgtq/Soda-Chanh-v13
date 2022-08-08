const { Permissions } = require('discord.js');

module.exports = class Command {
    constructor(client, name, options = {}) {
        this.client = client;
        this.name = options.name || name;
        this.aliases = options.aliases || [];
        this.description = options.description || "Không có mô tả được cung cấp.";
        this.category = options.category || "General";
        this.usage = `${this.name} ${options.usage || ''}` || "Không sử dụng được cung cấp.";
        this.examples = options.examples || [];
        this.disabled = options.disabled || false;
        this.cooldown = "cooldown" in options ? options.cooldown : 5 || 5;
        this.ownerOnly = options.ownerOnly || false;
        this.guildOnly = options.guildOnly || false;
        this.nsfwOnly = options.nsfwOnly || false;
        this.botPermission = options.botPermission || ['SEND_MESSAGES', 'EMBED_LINKS'];
        this.userPermission = options.userPermission  || null;
        
    }

    // eslint-disable-next-line no-unused-vars
    async run(message, args) {
        throw new Error(`Phương thức chạy chưa được triển khai trong ${this.name}`);
    }

    reload() {
        return this.store.load(this.file.path);
    }
}