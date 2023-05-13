import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { CandyMachine, CandyMachineV2, Metaplex } from "@metaplex-foundation/js"
import { FC, useEffect, useState } from "react"
import { Button } from "@chakra-ui/react"

export const FetchCandyMachine: FC = () => {
  const [candyMachineAddress, setCandyMachineAddress] = useState<PublicKey>()
  const [candyMachineData, setCandyMachineData] = useState<CandyMachineV2>()
  const [pageItems, setPageItems] = useState<any>()
  console.log('Bloom ~ file: fetchCandyMachine.tsx:12 ~ pageItems:', pageItems)
  const [page, setPage] = useState(1)

  const { connection } = useConnection()
  const metaplex = Metaplex.make(connection)


  const fetchCandyMachine = async () => {
    setPage(1)
    try {
      const candyMachine = await metaplex
        .candyMachinesV2()
        .findByAddress({ address: new PublicKey(candyMachineAddress!) })

      setCandyMachineData(candyMachine)
    } catch (e) {
      alert("Please submit a valid CMv2 address.")
    }
  }

  const getPage = async (page: number, perPage: number) => {
    if(candyMachineData) {
      const pageItems = candyMachineData.items.slice(
        (page - 1) * perPage,
        page * perPage
      )
  
      let nftData = []
      for (let i = 0; i < pageItems.length; i++) {
        let fetchResult = await fetch(pageItems[i].uri)
        let json = await fetchResult.json()
        nftData.push(json)
      }
  
      setPageItems(nftData)
    }
  }

  const prev = async () => {
    if (page - 1 < 1) {
      setPage(1)
    } else {
      setPage(page - 1)
    }
  }

  // next page
  const next = async () => {
    setPage(page + 1)
  }

  useEffect(() => {
    if (!candyMachineData) {
      return
    }
    getPage(page, 9)
  }, [candyMachineData, page])


  return (
    <div style={{
      display: 'flex'
    }}>
      <input
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center"
        placeholder="Enter Candy Machine v2 Address"
        onChange={(e: any) => setCandyMachineAddress(e.target.value)}
      />
      <Button
          bgColor="GrayText"
          color="white"
          maxW="380px"
        onClick={fetchCandyMachine}
        >
        Fetch
      </Button>

      {candyMachineData && (
        <div className="flex flex-col items-center justify-center p-5">
          <ul>Candy Machine Address: {candyMachineData.address.toString()}</ul>
        </div>
      )}

      {pageItems && (
        <div>
          <div className='gridNFT'>
            {pageItems.map((nft: any) => (
              <div key={nft.name}>
                <ul>{nft.name}</ul>
                <img src={nft.image} />
              </div>
            ))}
          </div>
          <Button
          bgColor="GrayText"
          color="white"
          maxW="380px"
            onClick={prev}
          >
            Prev
          </Button>
          <Button
          bgColor="GrayText"
          color="white"
          maxW="380px"
            onClick={next}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
