const Mail = require('../models/mail');
const Repositorie = require('../repositories/goal');
const fs = require('fs')

module.exports = {
    key: 'Goal',
    options: {

    },
    async handle({ data }) {
        const { table, id_salesman, file } = data;

        for (let line of table) {

            let year = line[2].split("-")[1];
            let month = line[2].split("-")[0];

            let i = { itemcode: line[1], date: `${year}-${month}-01` }
            const id_goalline = await Repositorie.search(i);

            console.log(i);
            if (id_goalline) {
                let item = {
                    id_goalline: id_goalline,
                    id_salesman: id_salesman,
                    amount: line[3]
                }

                const obj = await Repositorie.validate(item)

                if (obj && obj.amount && obj.amount !== item.amount) {
                    item.id_goal = obj.id_goal
                    await Repositorie.update(item)
                } else {
                    if (item.amount > 0) await Repositorie.insert(item)
                }
            }

        }

        fs.unlinkSync(`tmp/uploads/${file.filename}`)
    }
};