import axios from 'axios';

const instance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 3c40fbc4f0b98638f3afeb91785c5c3cb820ce25',
    }
});

export default instance;