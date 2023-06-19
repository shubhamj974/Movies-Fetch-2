const cl = console.log;

let baseUrl = `https://crud-api-json-default-rtdb.asia-southeast1.firebasedatabase.app/`;
let movieUrl = `${baseUrl}movies.json`

const showMoviesForm = document.getElementById('showMoviesForm');
const dropDownForm = document.getElementById('dropDownForm');
const backgroundOverly = document.getElementById('backgroundOverly');
const hideForm = [...document.getElementsByClassName('hideForm')];
const moviesDrop = document.getElementById('moviesDrop');
const titleControl = document.getElementById('title');
const imgUrlControl = document.getElementById('imgUrl');
const ratingControl = document.getElementById('rating');
const moviesContainer = document.getElementById('moviesContainer');
const addMovieBtn = document.getElementById('addMovieBtn');
const updateMovieBtn = document.getElementById('updateMovieBtn');
const cancelBtn = document.getElementById('cancelBtn')

const moviesTemp = (arr) => {
    let result = '';
    arr.forEach(ele => {
        moviesContainer.innerHTML = result +=
            `
        <div class="col-md-4 mt-5">
            <div class="card border-0" id="${ele.id}">
                <div class="card-header bg-primary text-white">
                    <h3>${ele.title}</h3>
                </div>
                <div class="card-body">
                    <img class="img-fluid"
                        src="${ele.imgUrl}"
                        alt="${ele.title}">
                </div>
                <div class="card-footer">
                    <p>5/${ele.rating}</p>
                    <button type="button" class="btn btn-primary mx-2" onclick="editBtnHandler(this)"><i
                            class="fas fa-user-edit"></i></button>
                    <button type="button" class="btn btn-danger" id="deleteBtn"
                        onclick="deleteBtnHandler(this)"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
        `
    })
}

const onHideShow = (e) => {
    dropDownForm.classList.toggle('visible');
    backgroundOverly.classList.toggle('visible');
}


const makeMoviesApiCall = (methodName, apiUrl, bodyMsg) => {
    return fetch(apiUrl, {
        method: methodName,
        body: JSON.stringify(bodyMsg),
        header: {
            "Authorization": "Bearer Token",
            "Content-Type": "application/json; charset=UTF-8"
        }
    })
        .then((res) => {
            return res.json()
        })
}

moviesDrop.addEventListener('submit', (e) => {
    e.preventDefault()
    let obj = {
        title: titleControl.value,
        imgUrl: imgUrlControl.value,
        rating: ratingControl.value
    }
    makeMoviesApiCall('POST', movieUrl, obj)
        .then((res) => {

            let card = document.createElement('div');
            card.className = `col-md-4 mt-5`
            let result =
                `
                <div class="card border-0" id="${res.name}">
                    <div class="card-header bg-primary text-white">
                        <h3>${obj.title}</h3>
                    </div>
                    <div class="card-body">
                        <img class="img-fluid"
                            src="${obj.imgUrl}"
                            alt="${obj.title}">
                    </div>
                    <div class="card-footer">
                        <p>5/${obj.rating}</p>
                        
                            <button type="button" class="btn btn-primary mx-2" onclick="editBtnHandler(this)"><i
                                    class="fas fa-user-edit"></i></button>
                            <button type="button" class="btn btn-danger" id="deleteBtn"
                                onclick="deleteBtnHandler(this)"><i class="fas fa-trash"></i></button>
                         
                    </div>
                </div>
            `
            card.innerHTML = result
            cl(card)
            moviesContainer.prepend(card)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Posts is Successfully Create',
                showConfirmButton: true,
                timer: 2000
            })

        })
        .catch((err) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err,
                timer: 3000
            })
        })
        .finally(() => {
            e.target.reset()
            dropDownForm.classList.toggle('visible');
            backgroundOverly.classList.toggle('visible');
        })
})


makeMoviesApiCall('GET', movieUrl)
    .then((res) => {
        let moviesArr = [];
        for (const key in res) {
            let data = {
                id: key,
                ...res[key]
            }
            moviesArr.unshift(data)
        }
        moviesTemp(moviesArr)
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Movies Api is Successfully',
            showConfirmButton: true,
            timer: 2000
        })
    })
    .catch((err) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err,
            timer: 3000
        })
    })


const editBtnHandler = (e) => {
    let editId = e.closest('.card').id;
    localStorage.setItem('editId', editId)
    let editUrl = `${baseUrl}movies/${editId}.json`
    makeMoviesApiCall('GET', editUrl)
        .then((res) => {
            titleControl.value = res.title;
            imgUrlControl.value = res.imgUrl;
            ratingControl.value = res.rating;
        })
        .catch((err) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err,
                timer: 3000
            })
        })
        .finally(() => {
            dropDownForm.classList.toggle('visible');
            backgroundOverly.classList.toggle('visible');
            addMovieBtn.classList.add('d-none');
            updateMovieBtn.classList.remove('d-none')
        })
}

updateMovieBtn.addEventListener('click', () => {
    let updateData = {
        title: titleControl.value,
        imgUrl: imgUrlControl.value,
        rating: ratingControl.value
    }
    let updateId = localStorage.getItem('editId');
    localStorage.removeItem('editId')
    let updateUrl = `${baseUrl}movies/${updateId}.json`
    makeMoviesApiCall("PATCH", updateUrl, updateData)
        .then((res) => {
            const updateID = [...document.getElementById(updateId).children];
            cl(updateID)
            updateID[0].innerHTML = `<h3>${updateData.title}</h3>`;
            updateID[1].innerHTML = `<img class="img-fluid" src="${updateData.imgUrl}" alt="${updateData.title}">`
            updateID[2].innerHTML =
                `   <p>5/${updateData.rating}</p>
                <button type="button" class="btn btn-primary mx-2" onclick="editBtnHandler(this)"><i
                    class="fas fa-user-edit"></i></button>
                <button type="button" class="btn btn-danger" id="deleteBtn"
                    onclick="deleteBtnHandler(this)"><i class="fas fa-trash"></i></button>
            `
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Movies Successfully Updated!!!',
                showConfirmButton: true,
                timer: 2000
            })
        })
        .catch((err) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err,
                timer: 3000
            })
        })
        .finally(() => {
            dropDownForm.classList.toggle('visible');
            backgroundOverly.classList.toggle('visible');
            addMovieBtn.classList.remove('d-none');
            updateMovieBtn.classList.add('d-none');
            moviesDrop.reset()
        })

})

const deleteBtnHandler = (e) => {
    let deleteId = e.closest('.card').getAttribute('id');
    let deleteUrl = `${baseUrl}movies/${deleteId}.json`
    makeMoviesApiCall('DELETE', deleteUrl)
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't to delete this movie!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success',
                makeMoviesApiCall('DELETE', deleteUrl)
                    .then((res) => {
                        const deleteID = document.getElementById(deleteId)
                        deleteID.remove()
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Movies Successfully Delete!!!',
                            showConfirmButton: true,
                            timer: 2000
                        })
                    })
                    .catch((err) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: err,
                            timer: 3000
                        })
                    })
                    .finally(() => {
                        loader.classList.add('d-none')
                    })
            )
        } else {
            return;
        }
    })
}

cancelBtn.addEventListener('click' , () => {
    moviesDrop.reset()
})

showMoviesForm.addEventListener('click', onHideShow);
hideForm.forEach(ele => ele.addEventListener('click', onHideShow));