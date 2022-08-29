// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: dove;
// Flamingo Widget v1.1 - by UnvsDev
// iPhone에서도 미술의 세계로 뛰어드세요.
// Learn More: https://github.com/unvsDev/Flamingo
// KR Version (Translated)

let today = new Date()
let fm = FileManager.iCloud()
const fDir = fm.joinPath(fm.documentsDirectory(), "/Flamingo/")
const fDir2 = fm.joinPath(fDir, "/artworks/")
const localPath = fm.joinPath(fDir, "artwork.txt")
const prefPath = fm.joinPath(fDir, "flamPref.txt")
var prefData = {
  artist: "!weekly",
  local: 0,
  refresh: 1800,
  title: true,
  rtitle: false,
  load: 0
}

var artworkOrgPref = {
  author: [],
  name: [],
  url: [],
  image: []
}

var bnum = 101 // Do not edit this area

if(!fm.fileExists(fDir)){ fm.createDirectory(fDir) }
if(fm.fileExists(prefPath)){
  prefData = JSON.parse(fm.readString(prefPath))
}
if(!fm.fileExists(localPath)){
  fm.writeString(localPath, JSON.stringify(artworkOrgPref))
  fm.createDirectory(fDir2)
}

var artveeCollections = {
  "Advertising Lithographs" : "https://artvee.com/collection/advertising-lithographs/",
  "Fashion Lithographs" : "https://artvee.com/collection/fashion-lithographs/",
  "Popular American Songs Covers" : "https://artvee.com/collection/popular-american-songs-covers/",
  "Fairy Tale illustrations" : "https://artvee.com/collection/fairy-tale-illustrations-from-elizabeth-tylers-home-and-school-series/",
  "NASA's Visions of the Future" : "https://artvee.com/collection/nasas-visions-of-the-future/",
  "Dietmar Winkler's MIT Posters" : "https://artvee.com/collection/dietmar-winklers-mit-posters/",
  "Book Promo Posters" : "https://artvee.com/collection/book-promo-posters/"
}

var endMode = false
if(config.runsInApp){
  const settings = new UITable()
  settings.showSeparators = true
  
  const info = new UITableRow()
  info.dismissOnSelect = false
  info.addText("플라밍고에 오신 것을 환영합니다!", "Developed by unvsDev")
  settings.addRow(info)
  
  const selectArtist = new UITableRow()
  selectArtist.dismissOnSelect = false
  selectArtist.addText("미술작품 필터 설정")
  settings.addRow(selectArtist)
  selectArtist.onSelect = async () => {
    let alert = new Alert()
    alert.title = "미술작품 주제 선택"
    alert.message = "어떠한 미술작품을 위젯에 표시하고 싶나요?"
    alert.addAction("특정 미술가의 작품")
    alert.addAction("Artvee의 주간 추천 작품")
    alert.addAction("특별 카테고리 작품")
    alert.addCancelAction("취소")
    
    let response = await alert.present()
    if(response == 0) {
      let inAlert = new Alert()
      inAlert.title = "미술가 검색"
      inAlert.message = "표시할 작품의 미술가의 이름을 영어로 입력하세요."
      inAlert.addTextField("Leonardo Da Vinci", "")
      inAlert.addAction("완료")
      inAlert.addCancelAction("취소")
      
      if(await inAlert.present() != -1){
        prefData.artist = inAlert.textFieldValue()
      }
    } else if(response == 1){
      prefData.artist = "!weekly"
    } else if(response == 2){
      const collectionView = new UITable()
      collectionView.showSeparators = true
      
      for(name in artveeCollections){
        const collectionRow = new UITableRow()
        collectionRow.dismissOnSelect = true
        collectionRow.addText(name)
        collectionView.addRow(collectionRow)
        
        collectionRow.onSelect = async () => {
          prefData.artist = artveeCollections[name]
        }
      }
      
      await collectionView.present()
    }
  }
  
  const selectLocal = new UITableRow()
  selectLocal.dismissOnSelect = false
  selectLocal.addText("오프라인 모드")
  settings.addRow(selectLocal)
  selectLocal.onSelect = async () => {
    let alert = new Alert()
    alert.title = "로컬 저장소에서 미술작품을 불러올까요?"
    alert.message = "위젯이 미술작품을 미리 다운로드받아 오프라인에서 표시할 수 있습니다! 원하는 옵션을 선택하세요."
    alert.addAction("항상 미술작품을 온라인에서 다운로드")
    alert.addAction("로컬에 저장된 미술작품만 보여주기")
    alert.addDestructiveAction("미술작품을 다운로드하지 않기")
    alert.addCancelAction("취소")
    
    let response = await alert.present()
    if(response != -1){
      prefData.local = response
    }
  }
  
  const selectRef = new UITableRow()
  selectRef.dismissOnSelect = false
  selectRef.addText("리프레시 주기 설정")
  settings.addRow(selectRef)
  selectRef.onSelect = async () => {
    let alert = new Alert()
    alert.title = "리프레시 주기 입력"
    alert.message = "iOS 정책에 의해, 예상했던 시간보다 위젯의 리프레시가 일부 변동될 수 있습니다."
    alert.addTextField("(초)", prefData.refresh.toString())
    alert.addAction("완료")
    alert.addCancelAction("취소")
    
    let response = await alert.present()
    if(response != -1){
      prefData.refresh = parseInt(alert.textFieldValue())
    }
  }
  
  const selectTitle = new UITableRow()
  selectTitle.dismissOnSelect = false
  selectTitle.addText("미술작품 정보 보이기")
  settings.addRow(selectTitle)
  selectTitle.onSelect = async () => {
    let alert = new Alert()
    alert.title = "미술작품 정보를 표시할까요?"
    alert.message = "위젯에 나타나는 미술작품의 제목과 미술가를 표시합니다."
    alert.addAction("네")
    alert.addAction("아니요")
    
    let response = await alert.present()
    if(response != -1){
      prefData.title = response ? false : true
    }
  }
  
  const selectRt = new UITableRow()
  selectRt.dismissOnSelect = false
  selectRt.addText("리프레시 정보 보이기")
  settings.addRow(selectRt)
  selectRt.onSelect = async () => {
    let alert = new Alert()
    alert.title = "리프레시 정보를 표시할까요?"
    alert.message = "위젯에 최근 마지막으로 리프레시된 시간을 표시합니다."
    alert.addAction("네")
    alert.addAction("아니요")
    
    let response = await alert.present()
    if(response != -1){
      prefData.rtitle = response ? false : true
    }
  }
  
  const selectLoad = new UITableRow()
  selectLoad.dismissOnSelect = false
  selectLoad.addText("미술작품 검색 범위")
  settings.addRow(selectLoad)
  selectLoad.onSelect = async () => {
    let alert = new Alert()
    alert.title = "검색 범위를 설정하세요"
    alert.message = "위젯이 설정된 범위만큼의 미술작품을 한 번에 검색합니다. 넓은 범위로 설정하면 다양한 미술작품이 표시될 수 있고, 좁은 범위로 설정하면 미술작품이 빠르게 표시될 수 있습니다. 검색 결과가 충분하지 않다면, 이 범위는 무시될 수도 있습니다."
    alert.addAction("20 (작음)")
    alert.addAction("50 (중간)")
    alert.addAction("100 (큼)")
    alert.addAction("200 (매우 큼)")
    alert.addCancelAction("Cancel")
    
    let response = await alert.present()
    if(response != -1){
      prefData.load = response
    }
  }
  
  const resetOption = new UITableRow()
  resetOption.dismissOnSelect = true
  resetOption.addText("데이터 초기화")
  settings.addRow(resetOption)
  resetOption.onSelect = async () => {
    endMode = true
    let alert = new Alert()
    alert.title = "정말 초기화하시겠어요?"
    alert.message = "초기화 옵션을 선택하세요.\n이 작업은 되돌릴 수 없습니다."
    alert.addDestructiveAction("위젯 설정만 초기화하기")
    alert.addDestructiveAction("다운로드된 미술작품도 초기화하기")
    alert.addCancelAction("취소")
    
    let response = await alert.present()
    if(response == 0){
      await fm.remove(prefPath)
    } else if(response == 1){
      await fm.remove(fDir)
    }
  }
  
  const saveOption = new UITableRow()
  saveOption.dismissOnSelect = true
  saveOption.addText("저장 후 끝내기")
  settings.addRow(saveOption)
  saveOption.onSelect = () => {
    endMode = true
  }
  
  await settings.present()
  fm.writeString(prefPath, JSON.stringify(prefData))
}

if(endMode){ return 0 }

prefData = JSON.parse(fm.readString(prefPath))

const artistInput = prefData.artist
const artist = artistInput.replace(/ /gi, "-").toLowerCase()
  
async function loadArts(artist){
  var chunk
  if(prefData.load == 0) { chunk = 20 }
  else if(prefData.load == 1) { chunk = 50 }
  else if(prefData.load == 2) { chunk = 100 }
  else { chunk = 200 }
  
  const baseUrl = 'https://artvee.com'
  var source
  if(artistInput == "!weekly") {
    source = 'https://artvee.com/highlights/'
  } else if(artistInput.indexOf("http") != -1){
    source = artistInput
  } else {
    source = `${baseUrl}/artist/${artist}/?per_page=`+ chunk
  }
  
  let webView = new WebView()
  await webView.loadURL(source)
  
  return webView.evaluateJavaScript(`
     let arts = [...document.querySelectorAll('.products .product-grid-item .product-wrapper')].map((ele) => {
        let productLinkEle = ele.querySelector('.product-element-top')
        let imageEle = productLinkEle.querySelector('img')
        let productInfoEle = ele.querySelector('.product-element-bottom')
        return {
           id: parseInt(productInfoEle.querySelector('.linko').dataset.id),
           title: productInfoEle.querySelector('h3.product-title > a').innerText,
           artist: {
              name: productInfoEle.querySelector('.woodmart-product-brands-links > a').innerText,
              info: productInfoEle.querySelector('.woodmart-product-brands-links').innerText,
              link: productInfoEle.querySelector('.woodmart-product-brands-links > a').getAttribute('href'),
           },
           link: productLinkEle.getAttribute('href'),
           image: {
              link: imageEle.getAttribute('src'),
              width: imageEle.getAttribute('width'),
              height: imageEle.getAttribute('height'),
           }
        }
     }).sort((prev, next) => prev.id - next.id)
                  
     completion(arts)
          `, true)
}

var offlineMode = (prefData.local == 1) ? true : false

let arts = []
try{
  const uServer = "https://github.com/unvsDev/Flamingo/raw/main/VERSION"
  const cServer = "https://github.com/unvsDev/Flamingo/raw/main/Flamingo.js"
  var minVer = parseInt(await new Request(uServer).loadString())
  if(bnum < minVer){
    var code = await new Request(cServer).loadString()
    fm.writeString(fm.joinPath(fm.documentsDirectory(), Script.name() + ".js"), code)
    return 0
  }
} catch(e) {
  offlineMode = true
}

if(!offlineMode){
  arts = await loadArts(artist)
  if(arts.length < 1){
    throw new Error("[!] No result found.")
    return 0
  }
}

let targetArt; let todayIdx
if(offlineMode){
  let localData = JSON.parse(fm.readString(localPath))
  todayIdx = Math.floor(Math.random() * localData.image.length)
  
  var artAuthor = localData.author[todayIdx]
  var artName = localData.name[todayIdx]
  var artUrl = localData.url[todayIdx]
  targetArt = await fm.readImage(fm.joinPath(fDir2, localData.image[todayIdx] + ".jpg"))
} else {
  // console.log('arts: ' + JSON.stringify(arts, null, 4))
  todayIdx = Math.floor(Math.random() * arts.length)
  let todayArt = arts[todayIdx]
  
  var artId = todayArt.id
  var artAuthor = todayArt.artist.info.split("(")[0]
  var artName = todayArt.title.split("(")[0]
  var artUrl = todayArt.link
  
  let localData = JSON.parse(fm.readString(localPath))
  if(localData.image.indexOf(artId) != -1){
    targetArt = await fm.readImage(fm.joinPath(fDir2, artId + ".jpg"))
    console.log("[*] Getting preloaded image.. (" + artId + ")")
  } else {
    targetArt = await new Request(todayArt.image.link).loadImage()
    console.log("[*] Downloaded image.. (" + artId + ")")
  }
  
  if(prefData.local == 0){
    let localData = JSON.parse(fm.readString(localPath))
    if(localData.image.indexOf(artId) == -1){
      localData.author.push(artAuthor)
      localData.name.push(artName)
      localData.image.push(artId)
      localData.url.push(artUrl)
      fm.writeImage(fm.joinPath(fDir2, artId + ".jpg"), targetArt)
      fm.writeString(localPath, JSON.stringify(localData))
    }
  }
}

let widget = new ListWidget()
widget.refreshAfterDate = new Date(Date.now() + 1000 * prefData.refresh)
widget.url = artUrl

widget.addSpacer()

let hStack = widget.addStack()
hStack.layoutHorizontally()

let lStack = hStack.addStack()
lStack.layoutVertically()

lStack.addSpacer()

if(prefData.title){
  let author = lStack.addText(artAuthor)
  author.textColor = Color.white()
  author.font = Font.lightMonospacedSystemFont(12)
  
  let title = lStack.addText(artName)
  title.textColor = Color.white()
  title.font = Font.boldMonospacedSystemFont(15)
}

if(prefData.rtitle){
  let rTitle = lStack.addText(offlineMode ? "업데이트: " + formatTime(today) : "업데이트: " + formatTime(today) + " (" + `${todayIdx + 1} / ${arts.length}` + ", ID: " + artId + ")")
  rTitle.textColor = Color.white()
  rTitle.font = Font.lightMonospacedSystemFont(9)
}
  
function formatTime(date) {
  let df = new DateFormatter()
  df.useNoDateStyle()
  df.useShortTimeStyle()
  return df.string(date)
}

hStack.addSpacer()

let rStack = hStack.addStack()
rStack.layoutVertically()

rStack.addSpacer()

let logo = rStack.addText("FLAMINGO")
logo.textColor = Color.white()
logo.font = Font.blackMonospacedSystemFont(8)

widget.addSpacer(3)

widget.backgroundImage = targetArt
widget.presentLarge()
