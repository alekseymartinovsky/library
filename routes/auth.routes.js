const {Router} = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const router = Router();

// api/auth/reg 
router.post(
    './register', 
    [
        check('email', 'Некорректный email'.isEmail(),
        check('password', 'Минимальная длина 6').isLength({min: 6})
        )
    ],
    async(req, res) => {
    try{
        const {email, password} = req.body;

        if(errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Данные при регистрации введены неверно'
            })
        }

        const newUser = await User.findOne({email});

        if(newUser){
            return res.status(400).json({message: "Такой пользователь существует "});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = newUser({email, password: hashedPassword});

        await user.save();

        res.status(201).json({message: 'Вы зареганы'});

    }catch (e){
        res.status(500).json({message: 'Что-то пошло не так'});
    }
})

// api/auth/login 
router.post(
    './login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async(req, res) => {
    try{
       const {email, password} = req.body;
    
        if(errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Данные при входе введены неверно'
            })
        }

        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: 'Данныее введены невeрно'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message: "Данныее введены нееврно"});
        }

        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )
            
        res.json({token, userId: user.id});

    }catch (e){
            res.status(500).json({message: 'Что-то пошло не так'});
    }    
})