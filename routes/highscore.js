const instance = require('../models').instance;

module.exports = function(app) {
    app.get('/highscore', function(req, res) {
        var orderBy = 'score';
        var orderDir = 'DESC';
        switch(req.query.order) {
            case 'name': orderBy = 'name'; orderDir = 'ASC'; break;
            case '3': orderBy = 'count3'; break;
            case '2': orderBy = 'count2'; break;
            case '1': orderBy = 'count1'; break;
            case '0': orderBy = 'count0'; break;
        }

        instance.query(`SELECT name, score, id, count3, count2, count1, count0,
            id = $id as isme,
            rank() over (order by score desc) as rank
            FROM score_table ORDER BY ` + orderBy + ' ' + orderDir,
            {
                type: instance.QueryTypes.SELECT,
                bind: {id: (req.user ? req.user.id : 0)}
            })
        .then(function(results) {
            res.render('highscore', {
                users: results,
                loggedIn: !!req.user,
                orderScore: orderBy === 'score',
                orderName: orderBy === 'name',
                order3: orderBy === 'count3',
                order2: orderBy === 'count2',
                order1: orderBy === 'count1',
                order0: orderBy === 'count0'
            });
        });
    });
};
