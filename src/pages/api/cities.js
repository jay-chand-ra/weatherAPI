import { cities } from '../../data/cities';

export default function handler(req, res) {
  const { state } = req.query;
  const selectedCities = cities[state] || [];
  res.status(200).json(selectedCities);
}
