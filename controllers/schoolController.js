import { addSchool, listSchools } from '../database.js'

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R= 6371;
    const dLat = (lat2-lat1)*Math.PI/180;
    const dLon = (lon2-lon1)*Math.PI/180;
  
    const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
              Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
  
    const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R*c;
};
// above function calculates the distance by using haversine formula

export const listSchoolsFunction = async (req,res) => {
         
    const { latitude, longitude } = req.query;

    // console.log(latitude)
    // console.log(longitude)

    if (!latitude || !longitude) {
        return res.status(400).json({
            error: 'Latitude and longitude are required. Kindly fill them!',
        });
    }
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({
            error: 'Latitude must be a valid float number between -90 and 90.',
        });
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
        return res.status(400).json({
            error: 'Longitude must be a valid float between -180 and 180.',
        });
    }

    const schools=await listSchools()
    if (!schools.length) {
        return res.status(404).json({ message: 'No schools found.' });
    }

    const schoolsWithDistance = schools.map((school) => {
        const distance = calculateDistance(
          parseFloat(latitude),
          parseFloat(longitude),
          school.latitude,
          school.longitude
        );
  
        const schoolData = school.dataValues || school; 
  
        return { ...schoolData, distance };
      });


    const sortedSchools = schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json({ schools: sortedSchools });  
}


export const addSchoolFunction = async (req,res) => {

    const {name,address,latitude,longitude} = req.body

    if (!name || !address || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
            error: 'All fields (Name, Address, Latitude, Longitude) are required.',
        });
    }

    const isValidLatitude = (lat) => typeof lat === 'number' && lat >= -90 && lat <= 90;
    const isValidLongitude = (lon) => typeof lon === 'number' && lon >= -180 && lon <= 180;

    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Name must be a non-empty string.' });
    }
    if (typeof address !== 'string' || address.trim() === '') {
        return res.status(400).json({ error: 'Address must be a non-empty string.' });
    }
    if (isNaN(latitude) || !isValidLatitude(Number(latitude))) {
        return res.status(400).json({
            error: 'Latitude must be a float number between -90 and 90.',
        });
    }
    if (isNaN(longitude) || !isValidLongitude(Number(longitude))) {
        return res.status(400).json({
            error: 'Longitude must be a float number between -180 and 180.',
        });
    }

    const school = await addSchool(name,address,latitude,longitude)
    res.status(201).send(school)
}