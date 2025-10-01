import Address from "../models/Address.js";

// Add Address: POST /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { userId, firstName, lastName, email, street, city, state, zipcode, country, phone } = req.body;

        // Validation
        if (!userId || !country || !zipcode) {
            return res.status(400).json({ success: false, message: "userId, country, and zipcode are required" });
        }

        const address = new Address({
            userId,
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            zipcode,
            country,
            phone
        });

        await address.save();
        return res.json({ success: true, message: "Address added successfully" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// Get Address: POST /api/address/get
export const getAddress = async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ success: false, message: "userId is required" });

        const addresses = await Address.find({ userId });
        return res.json({ success: true, addresses });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
};
