self.onmessage = (e: MessageEvent<number>) => {
    const limit = e.data;
    const primes: number[] = [];
    for (let i = 2; i <= limit; i++) {
      let isPrime = true;
      for (let j = 2; j <= Math.sqrt(i); j++) {
        if (i % j === 0) { isPrime = false; break; }
      }
      if (isPrime) primes.push(i);
    }
    self.postMessage({ primes, count: primes.length });
  };