
const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const members = require('../../Members');
const fs = require('fs');

// gets all members
router.get('/', (req, res) => res.json(members));
// get single member
router.get('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id));

    if(found) {
        res.json(members.filter(member => member.id === parseInt(req.params.id)));
    } else {
        res.status(400).json({ msg: `No member with the id of ${req.params.id}`});
    }
});

// Create Member
router.post('/', (req, res) => {
    const newMember = {
        id: uuid.v4(),
        name: req.body.name,
        email: req.body.email,
        experience: req.body.experience,
        signtime: Date.now(),
        status: 'active'
    }   

    if (!newMember.name || !newMember.email || !newMember.experience) {
        return res.status(400).json({ msg: 'Please include a name, email, and experience'});
    }  
    //connect to mongo
    //members.save(newMember)
    members.push(newMember);

    const membersheet = fs.createWriteStream('Members.js');
    const datalog = fs.createWriteStream('datalog.txt');
    datalog.write(`${newMember.signtime} | New Member: ${newMember.id}`);
    // members.forEach(value => writeStream.write(`${JSON.stringify(value)}\n`));
    membersheet.write(`const members = ${JSON.stringify(members, null, " ")}; \nmodule.exports = members;`)
    // res.json(members);
    res.redirect('/');
});

//Update member
router.put('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id));

    if(found) {
        const updMember = req.body;
        members.forEach(member => {
            if (member.id === parseInt(req.params.id)) {
                member.name = updMember.name ? updMember.name : member.name;
                member.email = updMember.email ? updMember.email : updMember.email;
                member.experience = updMember.experience ? updMember.experience : updMember.experience;

                res.json({ msg: 'Member updated', member});
            }
        });
    } else {
        res.status(400).json({ msg: `No member with the id of ${req.params.id}`});
    }
});


router.delete('/:id', (req, res) => {
    const found = members.some(member => member.id === parseInt(req.params.id));

    if(found) {
        res.json({ msg: 'member deleted', members: members.filter(member => member.id !== parseInt(req.params.id))});
    } else {
        res.status(400).json({ msg: `No member with the id of ${req.params.id}`});
    }
});

module.exports = router;
