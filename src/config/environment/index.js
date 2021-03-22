const development = require('./development')
const production = require('./production')
let environment = development;
if (process.env.NODE_ENV === 'production') {
    enviroment = production
}
module.exports = environment;