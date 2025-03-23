export default function validateOrigin(origin: string) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  
  return allowedOrigins.some(allowed => {
    if (allowed.includes('*')) {
      const pattern = allowed.replace('*', '.*');
      return new RegExp(pattern).test(origin);
    }
    console.log(allowed, origin, allowed === origin, 'allowed === origin');
    return allowed === origin;
  });
}