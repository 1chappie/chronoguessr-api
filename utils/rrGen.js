const util = require('util');

function randomDate() {
    const start = new Date(process.env.EARLIEST_YEAR, 0, 1);
    const end = new Date(process.env.LATEST_YEAR, 1, 1);

    // generate a random date between the end date and start date;
    // the resulting date string must have the format "DD/MM/YYYY"
    // if the year is < 0, BC must be appended to the year

    let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear() < 0 ? Math.abs(date.getFullYear()) + "BC" : date.getFullYear();
    return [day.toString(), month.toString(), year.toString()];
}

exports.rrGen = () => {
    const [day, month, year] = randomDate();
    const dateString = `${day}/${month}/${year}`;
    const rrLink = util.format(process.env.RR_LINK_FORMAT, dateString);
    return {rrLink: rrLink, year: parseInt(year)};
}