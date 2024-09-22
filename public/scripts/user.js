angular.module('telegramApp', ['ngSanitize'])
.controller('userCtrl', function ($http, $timeout, $window, $scope) {
    var d = this;
    const urlParams = new URLSearchParams(window.location.search);
    const tg = Telegram.WebApp;
    d.status = 'A';
    d.activeTab = 'A'
    
    d.all_products = [];

    d.step = 1;
    tg.MainButton.onClick(saveUser);
    tg.BackButton.onClick(back);

    tg.ready();

    function saveUser(){
        const userData = {
            chat_id: d.chat_id || null, // Add any other necessary fields
            name: d.name,
            phone_number: d.phone_number,
            username: d.username,
            is_admin: d.is_admin || 'N',
            status: d.status || 'A',
            lang: d.lang // Include the language or other relevant fields
        };

        if (d.user_id) {
         
            // Update existing user
            $http.put(`/api/users/${d.user_id}`, userData)
                .then(response => {
                    console.log('User updated successfully', response.data);
                    // Optionally redirect or update the view
                })
                .catch(error => {
                    console.error('Error updating user:', error);
                    // Handle error appropriately
                });
        } else {
            // Insert new user
            $http.post('/api/users', userData)
                .then(response => {
                    console.log('User added successfully', response.data);
                })
                .catch(error => {
                    console.error('Error adding user:', error);
                });
        }
        
        $window.location.reload();
    }



    $scope.$watch('d.step', function (step) {
        switch (step) {
            case 1:
                tg.MainButton.hide();
                break;
            case 2:
                tg.MainButton.onClick(saveUser);
                if (!d.user_id) {
                    tg.MainButton.text = 'save';
                } else {
                    tg.MainButton.text = 'update';
                }
                
                tg.BackButton.show(back);
                tg.MainButton.show();
                break;
          }
    });

    tg.BackButton.onClick(back);

    function step1() {
        d.step = 1;
      }

    function back(manual) {
        switch (d.step) {
          case 2: {
            step1();
            break;
          }
        }
        if (d.step > 1) d.error_message = '';
        if (!manual) $scope.$digest();
      }

    
    $('html').attr('data-bs-theme', tg.colorScheme);

    d.isSmall = $(document).width() < 380;


    function pf(val, dec = 0) {
        return parseFloat(parseFloat(val || 0).toFixed(dec));
    }

    function showError(res) {
        d.error_message = res?.data || res?.responseText || res;
    }

    function makePages(page_count) {
        d.page_count = pf(page_count);
        let lo = 4 - Math.min(d.page_count - d.current_page - 1, 2);
        let ro = 4 - Math.min(d.current_page, 2);
        d.pages = _.range(Math.max(d.current_page - lo, 0), Math.min(d.current_page + ro, d.page_count - 1) + 1);
    }

    function get(uri, param, success, fail = showError) {
        $http.get(uri, {
            params: param, // Pass params here
            headers: {
                "Content-Type": "application/json",
                "lang_code": urlParams.get('lang_code')
            }
        }).then(success, fail);
    }
    

   
    function getUsers(page_no, skipCheck) {
        if (!skipCheck && d.current_page === pf(page_no)) return;
        d.current_page = pf(page_no);
        
        get('/api/users', { search: d.search_user, page_no: d.current_page, status: d.status }, function(res) {
            if (res && res.data) {
                res = res.data;
                makePages(res.page_count);
                d.all_users = res.users;
                console.log("Fetched Users:", d.all_users);
            } else {
                console.error("Unexpected response structure:", res);
            }
        });
    }
    


    getUsers(0, true);

    function prevPage() {
        if (d.current_page > 0) {
            getUsers(d.current_page - 1);
        }
    }
  
    function nextPage() {
        if (d.current_page < d.page_count - 1) {
            getUsers(d.current_page + 1);
        }
    }

    function openUser(user) {
        if (user) {
            d.user_id = user.user_id;
            d.chat_id = user.chat_id;
            d.user_photoUrl = user.photoUrl;
            d.name = user.name;
            d.phone_number = user.phone_number; 
            d.username = user.username;
            d.is_admin  = user.is_admin;
            d.status = user.status;
            d.lang = user.lang;
        } else {
            d.user_id = '';
            d.chat_id = '';
            d.user_photoUrl = '';
            d.name = '';
            d.phone_number = ''; 
            d.username = '';
            d.is_admin  = '';
            d.status = '';
            d.lang = '';
        }




        d.step = 2;
    }

    function activeUser(user){
        user.status = 'A'; // Change status to Active
        $http.put(`/api/users/${user.user_id}`, user)  // Update user status via PUT request
            .then(response => {
                console.log('User activated:', response.data);
            })
            .catch(error => {
                console.error('Error activating user:', error);
            });

            $window.location.reload();
    }

    function passiveUser(user){
        user.status = 'P'; // Change status to Passive
        $http.put(`/api/users/${user.user_id}`, user)  // Update user status via PUT request
            .then(response => {
                console.log('User made passive:', response.data);
            })
            .catch(error => {
                console.error('Error making user passive:', error);
            });

            $window.location.reload();
    }

    function deleteUser(user){
        $http.delete(`/api/users/${user.user_id}`)  // Delete user via DELETE request
        .then(response => {
            console.log('User deleted:', response.data);
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });

        $window.location.reload();
    }

    d.getUsers = getUsers;
    d.prevPage = prevPage;
    d.nextPage = nextPage;
    d.openUser = openUser;
    d.passiveUser = passiveUser;
    d.activeUser = activeUser;
    d.deleteUser = deleteUser;
});