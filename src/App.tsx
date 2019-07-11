import React, { Fragment,  useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import CloudDone from '@material-ui/icons/CloudDone';
import 'typeface-roboto';
import contentHash from 'content-hash';
import Web3 from 'web3';

// https://cloudflare-ipfs.com/ipfs/QmQRmKoVi5a1CCWDNUFPRdEixMQfsZ2ECC5e2nQF1Gwi86/

/*
https://content-hash.surge.sh

https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1577.md

*/
function createDescription(name: String, author: String, thumbnail: String, preview: String, ids: String[]): string {
  const stickers = ids.map(id => `{:hash "${id}"}`).join('');
  // TODO add :hash
  return `{meta {:name      "${name}"
                 :author    "${author}"
                 :thumbnail "${thumbnail}"
                 :preview   "${preview}"
                 :stickers [${stickers}]}}`;
}

async function ipfsAdd(content: string | Blob) {
  const formData  = new FormData();
  formData.append("", content);
  const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
    method: 'post',
    body: formData
  });
  if (response.status === 200) {
    return response.json();
  }
  return null;
}

async function uploadFile(name: string, author: string, thumbnail: string, preview: string, stickers: string[]) {
  const description = createDescription(name, author, contentHash.fromIpfs(thumbnail),
                                        contentHash.fromIpfs(preview), 
                                        stickers.map(contentHash.fromIpfs));
  return ipfsAdd(description);
}

var divStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '40vw',
  alignItems: "center"
};

const ABI = [{"constant":false,
                       "inputs":[{"name":"_packId",
                                  "type":"uint256"},
                                 {"name":"_limit",
                                  "type":"uint256"}],
                       "name":"purgePack","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"interfaceId","type":"bytes4"}],
                       "name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
                       {"constant":true,"inputs":[],"name":"snt","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},
                       {"constant":true,"inputs":[{"name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"name":"","type":"address"}],
                       "payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},
                       {"name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
                       {"constant":false,"inputs":[{"name":"_price","type":"uint256"},{"name":"_donate","type":"uint256"},{"name":"_category","type":"bytes4[]"},
                       {"name":"_owner","type":"address"},{"name":"_contenthash","type":"bytes"}],"name":"registerPack","outputs":[{"name":"packId","type":"uint256"}],
                       "payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"},
                       {"name":"_packId","type":"uint256"}],"name":"generateToken","outputs":[{"name":"tokenId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable",
                       "type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"setBurnRate","outputs":[],"payable":false,"stateMutability":"nonpayable",
                       "type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],
                       "name":"transferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},
                       {"name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
                       {"constant":false,"inputs":[{"name":"_newController","type":"address"}],"name":"changeController","outputs":[],"payable":false,"stateMutability":"nonpayable",
                       "type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenId","type":"uint256"}],
                       "name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_state","type":"uint8"}],
                       "name":"setMarketState","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],
                       "name":"packCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
                       {"constant":true,"inputs":[{"name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view",
                       "type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,
                       "stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_packId","type":"uint256"},{"name":"_to","type":"address"}],"name":"setPackOwner",
                       "outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},
                       {"name":"","type":"uint256"},{"name":"_token","type":"address"},{"name":"_data","type":"bytes"}],"name":"receiveApproval","outputs":[],"payable":false,
                       "stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_packId","type":"uint256"},{"name":"_destination","type":"address"}],
                       "name":"buyToken","outputs":[{"name":"tokenId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},
                       {"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"setRegisterFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
                       {"constant":false,"inputs":[{"name":"_packId","type":"uint256"},{"name":"_price","type":"uint256"},{"name":"_donate","type":"uint256"}],
                       "name":"setPackPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenCount",
                       "outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_category","type":"bytes4"}],
                       "name":"getCategoryLength","outputs":[{"name":"size","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,
                       "inputs":[{"name":"to","type":"address"},{"name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"payable":false,
                       "stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokenPackId",
                       "outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_packId","type":"uint256"},
                       {"name":"_category","type":"bytes4"}],"name":"addPackCategory","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
                       {"constant":true,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getTokenData","outputs":[{"name":"category","type":"bytes4[]"},
                       {"name":"timestamp","type":"uint256"},{"name":"contenthash","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},
                       {"constant":true,"inputs":[{"name":"_category","type":"bytes4"}],"name":"getAvailablePacks","outputs":[{"name":"availableIds","type":"uint256[]"}],
                       "payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_category","type":"bytes4"},{"name":"_index","type":"uint256"}],
                       "name":"getCategoryPack","outputs":[{"name":"packId","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_packId","type":"uint256"},
                       {"name":"_mintable","type":"bool"}],"name":"setPackState","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],
                       "name":"packs","outputs":[{"name":"owner","type":"address"},{"name":"mintable","type":"bool"},{"name":"timestamp","type":"uint256"},{"name":"price","type":"uint256"},{"name":"donate","type":"uint256"},
                       {"name":"contenthash","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},
                       {"name":"tokenId","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},
                       {"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_packId",
                       "type":"uint256"}],"name":"getPackData","outputs":[{"name":"category","type":"bytes4[]"},{"name":"owner","type":"address"},{"name":"mintable","type":"bool"},{"name":"timestamp","type":"uint256"},
                       {"name":"price","type":"uint256"},{"name":"contenthash","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"}],
                       "name":"claimTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_packId","type":"uint256"},{"name":"_category","type":"bytes4"}],
                       "name":"removePackCategory","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},
                       {"name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},
                       {"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"tokensOwnedBy","outputs":[{"name":"tokenList","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},
                       {"constant":true,"inputs":[],"name":"controller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_snt","type":"address"}],
                       "payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"packId","type":"uint256"},{"indexed":false,"name":"dataPrice","type":"uint256"},
                       {"indexed":false,"name":"_contenthash","type":"bytes"}],"name":"Register","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"category","type":"bytes4"},{"indexed":true,"name":"packId",
                       "type":"uint256"}],"name":"Categorized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"category","type":"bytes4"},{"indexed":true,"name":"packId","type":"uint256"}],
                       "name":"Uncategorized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"packId","type":"uint256"}],"name":"Unregister","type":"event"},{"anonymous":false,
                       "inputs":[{"indexed":true,"name":"_token","type":"address"},{"indexed":true,"name":"_controller","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"ClaimedTokens",
                       "type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"state","type":"uint8"}],"name":"MarketState","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"value",
                       "type":"uint256"}],"name":"RegisterFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"value","type":"uint256"}],"name":"BurnRate","type":"event"},{"anonymous":false,
                       "inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},
                       {"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"approved","type":"address"},{"indexed":true,"name":"tokenId","type":"uint256"}],
                       "name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"operator","type":"address"},{"indexed":false,
                       "name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"}];

const Home = (props: any) => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setPreview] = useState("");
  const [preview, setBanner] = useState("");
  const [stickers, setStickers] = useState([]);
  const [hash, setHash] = useState("");

  const uploadDescription = async (_: any) => {
    const res = await uploadFile(name, author, thumbnail, preview, stickers);
    setHash(res.Hash);
  };

  const register = async (_: any) => {
    const addresses = await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    web3.eth.Contract(ABI, "0x39d16CdB56b5a6a89e1A397A13Fe48034694316E").methods
      .registerPack("0", "0", ["0x00000000", "0x00000001"], addresses[0], "0x"+contentHash.fromIpfs(hash).replace('e30101', 'e301')).send({"from": addresses[0]} );
  };

  const handleThumbnail = async (e: any) => {
    setThumbnail("");
    ipfsAdd(e.target.files[0]).then(res => setThumbnail(res.Hash));
  };

  const handlePreview = async (e: any) => {
    setPreview("");
    ipfsAdd(e.target.files[0]).then(res => setThumbnail(res.Hash));
  };

  const handleStickers = async (e: any) => {
    setStickers([]);
    const files = Array.from(e.target.files);
    Promise.all(files.map(ipfsAdd)).then(all => {
      setStickers(all.map(a => a.Hash));
    })
  };

  const complete = name.length != 0 && author.length != 0 && thumbnail.length != 0 && stickers.length != 0;

  return (
    <div id="form" style={divStyle}>
      <Input value={name}
             onChange={e => setName(e.target.value)}
             placeholder="Name" required/>
      <Input value={author}
             onChange={e => setAuthor(e.target.value)}
             placeholder="Author" required/>
      <Input value={price}
             onChange={e => setPrice(e.target.value)}
             placeholder="Price" required/>
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-thumbnail"
        onChange={handleThumbnail}
        type="file"
      />
      <label htmlFor="raised-button-thumbnail">
        <Button variant="contained" component="span">
          {thumbnail.length != 0 &&
            <CloudDone />  
          }
          Upload thumbnail
        </Button>
      </label> 
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-preview"
        onChange={handlePreview}
        type="file"
      />
      <label htmlFor="raised-button-preview">
        <Button variant="contained" component="span">
          {preview.length != 0 &&
            <CloudDone />  
          }
          Upload preview
        </Button>
      </label> 
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-stickers"
        multiple
        onChange={handleStickers}
        type="file"
      />
      <label htmlFor="raised-button-stickers">
        <Button variant="contained" component="span">
          {stickers.length != 0 &&
              <CloudDone />  
          }
          Upload stickers
        </Button>
      </label> 
      <Button variant="contained" color="primary" onClick={uploadDescription} disabled={!complete}>
        Deploy
      </Button>
      {hash && hash.length != 0 &&
        <Fragment>
          <div>IPFS Hash: {hash}</div>
          <a href={'https://ipfs.infura.io/ipfs/'+hash}>link</a>
          <Button variant="contained" color="primary" onClick={register}>
            Publish
          </Button>
        </Fragment>
      }
    </div>);
};

var containerStyle = {
  display: 'flex',
  justifyContent: "center",
  alignItems: "center",
  height: "100vh"
};

function App() {
  return (
    <div style={containerStyle}>
      <Home />
    </div>
  );
}

export default App;
