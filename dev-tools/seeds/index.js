// use these seeds and push it once in mongoDB to edit/delete/apply filters on your data. run node index.js once. 

const mongoose = require('mongoose');
const Campground = require('../../models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/campexxa'); 

const db = mongoose.connection; 
db.on('error', console.error.bind(console, 'connection error: '))
db.once('open', () => {
    console.log("database connected !")
})

const sample =  array => array[Math.floor(Math.random() * array.length )]

const seedDB = async () => {
    await Campground.deleteMany({})
    for(let i = 0; i < 200; i++){
        const random1000 = Math.floor(Math.random() * 1000); 
        const price = Math.floor(Math.random() * 20) + 10; 
        const camp = new Campground({
            auther: '69174d17cac69995950a26c0', //your user id
            location: `${cities[random1000].city}, ${cities[random1000].state}`, 
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://picsum.photos/400?random=${Math.random()}', 
            description: 'lorem hvbwd wdivbvj ivgwdojbrv ige ojcbw hgfwejb wfgjifbr yfbibf hfwfib gfweijgb3r wygfweif ywrgfiwbg wbe Abinash dash !', 
            price, 
            geometry: {
                type: 'Point', 
                coordinates: [
                    cities[random1000].longitude, 
                    cities[random1000].latitude, 
                ]
            }, 
            images:  [
                {
                    url: 'https://res.cloudinary.com/dgpocpyjm/image/upload/v1763300513/Campexxa/ymekdxdlmnrvftoyx5pb.jpg',
                    filename: 'Campexxa/ymekdxdlmnrvftoyx5pb',
                },
                {
                    url: 'https://res.cloudinary.com/dgpocpyjm/image/upload/v1763300516/Campexxa/zqdqapwc04bym8iywmji.jpg',
                    filename: 'Campexxa/zqdqapwc04bym8iywmji',
                }
            ]
        })
        await camp.save(); 
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})