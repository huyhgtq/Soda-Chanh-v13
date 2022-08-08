const Command = require('../../structures/Command');
const Maintenance = require('../../database/schemas/maintenance')
module.exports = class extends Command {
    constructor(...args) {
      super(...args, {
        name: 'maintenance',
        aliases: [ 'maintenance' ],
        description: 'Đặt bot để bảo trì enable / disable',
        category: 'Owner',
        ownerOnly: true
      });
    }

    async run(message, args) {

      if(!args[0]) return message.reply('Bạn có muốn enable hay disable chế độ bảo trì không?')
      
      const maintenance = await Maintenance.findOne({maintenance: 'maintenance'})

      if(args[0].toLowerCase() == "enable"){
      if(maintenance){

      maintenance.toggle = "true"
      await maintenance.save();

      } else {
        const newMain = new Maintenance({
          toggle: "true"
        })
        newMain.save().catch(()=>{})
      }
      await message.reply('Bật chế độ bảo trì')
      process.exit(1)

      } else if(args[0].toLowerCase() == "disable"){

 if(maintenance){
      maintenance.toggle = "false"
      await maintenance.save();

      } else {
        const newMain = new Maintenance({
          toggle: "false"
        })
        newMain.save().catch(()=>{})
      }
      await message.reply('Tắt chế độ bảo trì')
      process.exit(1)

      } else {
        message.reply('Phản hồi không hợp lệ')
      }
      
    }
};
