export default async function handler(req, res) {
  const { slug } = req.query;
  
  // Hardcoded links for testing
  const links = {
    'abc123': 'https://google.com',
    'xyz789': 'https://youtube.com',
    'XKl422': 'https://youtube.com'
  };
  
  const url = links[slug];
  
  if (url) {
    return res.redirect(301, url);
  } else {
    return res.status(404).send('Link not found');
  }
}
