import userModel from '../Models/userModel.js';

// สมัครสมาชิก
const register = async (req, res) => {
  try {
    const { uid, email, firstName, lastName, phoneNumber, dateOfBirth } =
      req.body;
    const newUser = new userModel({
      uid,
      email,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
    });
    await newUser.save();
    res.status(201).send('User created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// ดึงข้อมูลผู้ใช้
const getUserById = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const uid = req.user?.uid;

    const user = await userModel.findOne({ uid });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', err });
  }
};

// อัพเดทข้อมูลผู้ใช้
const updateUserInfo = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { firstName, lastName, phoneNumber, dateOfBirth } = req.body;

    const uid = req.user?.uid; // ป้องกัน undefined

    const updatedUser = await userModel.findOneAndUpdate(
      { uid },
      { $set: { firstName, lastName, phoneNumber, dateOfBirth } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({
      message: 'User information updated successfully.',
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
  }
};

// เพิ่มที่อยู่ผู้ใช้
const createAddress = async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { address } = req.body;

    const uid = req.user?.uid; // ป้องกัน undefined

    const user = await userModel.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ตรวจสอบข้อมูล address ก่อนเพิ่ม
    if (
      !address ||
      !address.addressType ||
      !address.addressDetails ||
      !address.postCode
    ) {
      return res.status(400).json({ message: 'Invalid address data' });
    }

    // ถ้า address ที่ส่งมามี isDefault = true → set address เดิมทั้งหมดให้ isDefault = false
    if (address.isDefault) {
      user.address.forEach((addr) => (addr.isDefault = false));
    }

    user.address.push(address); // เพิ่มที่อยู่ใหม่เข้าไปใน array
    await user.save();

    res
      .status(200)
      .json({ message: 'Address added successfully', address: user.address });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// อัพเดทที่อยู่ผู้ใช้
const updateUserAddress = async (req, res) => {
  const { addressId } = req.params;

  const {
    firstName,
    lastName,
    phoneNumber,
    addressType,
    addressDetails,
    postCode,
    isDefault,
  } = req.body;

  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const uid = req.user?.uid;

    const user = await userModel.findOne({ uid });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const address = user.address.id(addressId);

    if (!address)
      return res
        .status(404)
        .json({ message: 'Address not found with that ID' });

    address.firstName = firstName;
    address.lastName = lastName;
    address.phoneNumber = phoneNumber;
    address.addressType = addressType;
    address.addressDetails = addressDetails;
    address.postCode = postCode;

    // ถ้า isDefault เป็น true ให้ reset อันอื่นก่อน
    if (isDefault === true) {
      user.address.forEach((addr) => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }

    await user.save();

    res.json({ message: 'Address updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const setDefaultAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const uid = req.user?.uid;

    const user = await userModel.findOne({ uid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let found = false;

    user.address.forEach((addr) => {
      if (addr._id.toString() === addressId) {
        addr.isDefault = true;
        found = true;
      } else {
        addr.isDefault = false;
      }
    });

    if (!found) {
      return res
        .status(404)
        .json({ message: 'Address not found with that ID' });
    }

    await user.save();

    res.json({ message: 'Default address updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ลบที่อยู่ผู้ใช้
const deleteUserAddress = async (req, res) => {
  const { addressId } = req.params;

  try {
    const uid = req.user?.uid;

    const user = await userModel.findOne({ uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const address = user.address.id(addressId);

    if (!address)
      return res
        .status(404)
        .json({ message: 'Address not found with that ID' });

    const addressIndex = user.address.findIndex(
      (index) => index._id.toString() === addressId
    );
    if (addressIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Address not found with that ID' });
    }

    user.address.splice(addressIndex, 1);

    await user.save();

    return res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUserAddress:', error);
    res.status(500).json({ message: error.message });
  }
};

export {
  register,
  getUserById,
  updateUserInfo,
  createAddress,
  updateUserAddress,
  setDefaultAddress,
  deleteUserAddress,
};
