


const express = require('express');
const router = express.Router();
const User = require('../models/users'); // Import your User model


router.get('/',(req,res)=>{
    // res.send("HOME PAGE");
    res.render('index',{title:'Review & Rating'});  // this is used for render views page(user interface page like ejs page): index - file name of the ejs file
                            // and in the second bracker we pass value of the ejs variable "title" which is used in index page in title portion.
})


// Handle POST request to submit a rating
router.post('/submit_rating', async (req, res) => {
    try {
        const { rating_data, user_name, user_review, product_id } = req.body;

        const newUser = new User({
            rating_data: rating_data,
            user_name: user_name,
            user_review: user_review,
            product_id: product_id, // Set the product ID
        });

        await newUser.save();

        res.status(201).send('Review submitted successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});




router.get('/fetch_ratings/:product_id', async (req, res) => {
    try {
        const { product_id } = req.params;

        // Query the database to retrieve reviews for the specified product ID
        const reviews = await User.find({ product_id: product_id }, 'user_name user_review rating_data created')
            .sort({ created: 'desc' });

        let average_rating = 0;
        let total_review = 0;
        let five_star_review = 0;
        let four_star_review = 0;
        let three_star_review = 0;
        let two_star_review = 0;
        let one_star_review = 0;
        let total_user_rating = 0;

        const review_content = [];

        reviews.forEach((review) => {
            review_content.push({
                user_name: review.user_name,
                user_review: review.user_review,
                rating: review.rating_data,
                datetime: review.created,
            });

            switch (review.rating_data) {
                case 5:
                    five_star_review++;
                    break;
                case 4:
                    four_star_review++;
                    break;
                case 3:
                    three_star_review++;
                    break;
                case 2:
                    two_star_review++;
                    break;
                case 1:
                    one_star_review++;
                    break;
            }

            total_review++;
            total_user_rating += review.rating_data;
        });

        if (total_review > 0) {
            average_rating = total_user_rating / total_review;
        }

        const output = {
            average_rating: parseFloat(average_rating.toFixed(1)),
            total_review,
            five_star_review,
            four_star_review,
            three_star_review,
            two_star_review,
            one_star_review,
            review_data: review_content,
        };

        res.status(200).json(output);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});





module.exports = router;
