import 'components/dashboard/dashboard.css!css';

function  Workbook() {
    if(!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function  sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
    for(var R = 0; R != data.length; ++R) {
        for(var C = 0; C != data[R].length; ++C) {
            if(range.s.r > R) range.s.r = R;
            if(range.s.c > C) range.s.c = C;
            if(range.e.r < R) range.e.r = R;
            if(range.e.c < C) range.e.c = C;
            var cell = {v: data[R][C] };
            if(cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

            if(typeof cell.v === 'number') cell.t = 'n';
            else if(typeof cell.v === 'boolean') cell.t = 'b';
            else if(cell.v instanceof Date) {
                cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            }
            else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}


class DashboardController {
    constructor($window, $location, authentication,$timeout) {
        this.$location =$location;
        this.authentication = authentication;
        this.$window = $window;
        this.$timeout = $timeout;
        this.isRecipeSelected = false;
        this.detailRecipe = {};
        this.Zipcode = "";
        this.recipeList = [
            {
                name: "Nearest Pizza Hut Recipe",
                description: "Get the addess of Nearest Pizza Hut based on a zip code",
                img: 'images/pizzahut.jpg',
                isActive: false
            },
            {
                name: "Nearest KFC Recipe",
                description: "Get the addess of Nearest KFC based on a zip code",
                img: 'images/KFC_Logo.png',
                isActive: false
            }
        ];
        //this.validateUser($window);
    }

    validateUser($window) {
        let obj = $window.sessionStorage.getItem("token");
        if (!obj) {
            this.$location.path("/login")
        }
    }

    closeDetailContainer (){
        this.isRecipeSelected = false;
        this.recipeindex = null;
        this.detailRecipe = {};
    }


    logoutClicked () {
        let vm = this;
        this.authentication.logoutClicked(vm.$window.sessionStorage.getItem("token"),function (data) {
            vm.$window.sessionStorage.removeItem("token");
            vm.$location.path("/login")
        }, function (error) {
            //if (error.status === 204) {
            //    vm.$window.sessionStorage.removeItem("token")
            //}
        })
    }

    recipeSelected (index) {
        if (this.recipeindex == index) {
            return;
        }
        this.recipeindex = index;
        this.recipeList[index].isActive = true;
        this.recipeList[1-index].isActive = false;
        this.detailRecipe = this.recipeList[index];
        this.isRecipeSelected = true;
    }



    authenticateUser () {
        let vm = this,
            options = {
                success: function(files) {
                    client.readFile(files[0].name, {binary: true},function(error, contents,s) {
                        if (error) {
                            return showError(error);  // Something went wrong.
                        }

                        var workbook = XLSX.read(contents, {type:"binary"});




                        /*Reading excel sheet*/
                        var sheet_name_list = workbook.SheetNames;
                        var zipcodes = [];
                        sheet_name_list.forEach(function(y) { /* iterate through sheets */
                            var worksheet = workbook.Sheets[y];
                            for (var z in worksheet) {
                                if(z[0] === '!') continue;
                                let key = worksheet[z].v;
                                zipcodes.push(key);
                            }
                        });
                        /**/

                        console.log("Zipcodes =" + zipcodes);
                        //ajax call fo fetching addess for respective zipcodes
                       // TODO:

                        vm.$timeout(function () {

                            //var ary = ["23455","2344234","23423434"];

                            var obj  = {
                                "23450" : {
                                    "address1":"jsdj kjfhjf dkshfjdshkfj",
                                    "address2":"nmn m njsdj kjfhjf dkshfjdshkfj",
                                    "address3":"jsdj kjkl zxlk fhjf dkshfjdshkfj"
                                },
                                "23440" : {
                                    "address":"jsdj kjfhjf dkshfjdshkfj"
                                },
                                "2345" : {
                                    "address":"jsdj kjfhjf dkshfjdshkfj"
                                }
                            };

//;

                            var data = R.flatten(R.map(function (item) {
                                return R.map(function (address) {
                                    return [item].concat(address);
                                },R.values(obj[item]))
                            },zipcodes));
                            var buildData = [];
                            var ary = [];
                            for (var i = 0;i < data.length;i++) {
                                if ((i %2 !== 0 )) {
                                    ary.push(data[i]);
                                    buildData.push(ary);
                                    ary = [];
                                } else {
                                    ary.push(data[i]);
                                }
                            }

                            vm.createExcelsheet(buildData, client);

                        } , 1000);

                        /*building data for creating Excel sheet*/
                        /*let data= [
                            [
                                "456546",
                                "Address 1"
                            ],
                            [
                                "",
                                "Address 2"
                            ],
                            [
                                "",
                                "Address 3"
                            ],
                            [
                                "679899",
                                "Address 1"
                            ],
                            [
                                "",
                                "Address 3"
                            ],
                            [
                                "",
                                "Address 4"
                            ]
                        ];*/




                    });
                },
                cancel: function() {

                },
                linkType: "preview", // or "direct"
                multiselect: false, // or true
                extensions: ['.txt','.xlsx']
            },
            client = new window.Dropbox.Client({ key: 'ypioz5hh2ezva3l' });

        client.authenticate(function(error, client) {
            if (error) {
                //return showError(error);
            }
            Dropbox.choose(options);
        });
    }

    createExcelsheet (data, client) {
        var ranges = [];
        var ws_name = "SheetJS";
        var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

        /* add ranges to worksheet */
        ws['!merges'] = ranges;

        /* add worksheet to workbook */
        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = ws;

        //XLSX.write(wb, 'test.xlsx');

        var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'});

        /* the saveAs call downloads a file on the local machine */
        var endData = new Blob([s2ab(wbout)],{type:""});
        //saveAs(, "test.xlsx")


        /*file writing code*/
        client.writeFile("fileName.xlsx",endData, function () {
            alert('File written!');
        });
    }

    goButtonClicked () {

    }

}
DashboardController.$inject = ['$window','$location','authentication','$timeout'];

export default DashboardController;