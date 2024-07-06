import { useAccount } from 'wagmi'
import { useMarketplace } from '../../hooks';

export function Home() {
  const { isConnected } = useAccount()
  const { items, loading } = useMarketplace()

  return (
    <section className="w-full h-screen flex flex-col gap-5 justify-center items-center">
      {
        !isConnected ? (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-white text-2xl font-medium">Waiting for Metamask's connection...</p>
          </div>
        ) : loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-white text-2xl font-medium">Loading items...</p>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center flex-col gap-5">
            {
              items.length !== 0
              ? (
                <></>
              ) : (
                <span className='text-3xl text-white font-medium'>No assets...</span>
              )
            }
          </div>
        )
      }
    </section>
  );
}
