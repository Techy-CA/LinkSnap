export default function handler(req, res) {
  const links = {
    'abc123': 'https://google.com',
    'xyz789': 'https://youtube.com'
  };
  
  const slug = req.query.slug;
  const url = links[slug];
  
  if (url) {
    res.redirect(301, url);
  } else {
    res.status(404).send('Not found');
  }
}
