const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2 mt-3 mb-3';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick="selectItem(event, '${image.webformatURL}')" src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
  })
  toggleSpinner();
}
const getImages = (query) => {
  toggleSpinner();
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err));
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');
  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders = sliders.filter((x) => { return x !== img })
    //alert('Hey, Already added !')
  }
}
//Event listener for Enter button
document.getElementById('search').addEventListener('keypress', function (event) {
  if (event.key == 'Enter') {
    document.getElementById('search-btn').click();
  }
})

var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const duration = document.getElementById('duration').value || 1000;
  if (duration > 0) {
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })

    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  } else {
    alert('Please Enter a positive duration value.');
    document.getElementById('search-btn').click();
    document.getElementById('duration').value = '';

  }
  selectedList();
}
// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}
// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

//Function for Loading spinner
const toggleSpinner = (show) => {
  const spinner = document.getElementById('loading-images');
  spinner.classList.toggle('d-none');
  spinner.classList.toggle('d-flex');
}

//Function for selected Image's list to show bellow slider
selectedList = () => {
  sliders.forEach(singleImage => {
    let listDiv = document.createElement('div');
    listDiv.innerHTML = `
    <img class="list-img m-3 rounded " src="${singleImage}" alt="${singleImage}">`;
    document.getElementById("selected-images").appendChild(listDiv);

  })
}

