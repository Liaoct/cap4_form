import Vue from 'vue';
import Router from 'vue-router';
import Hello from '@/components/Hello';
import Sheet from '@/business/sheet';
import Create from '@/components/Create';
import Edit from '@/components/edit';
import Browse from '@/components/browse';

Vue.use(Router);

export default new Router({
    routes : [
        {
            path : '/',
            name : 'Create',
            component : Create
        },
        {
            path : '/create',
            name : 'Create',
            component : Create
        },
        {
            path : '/edit',
            name : 'Edit',
            component : Edit
        },
        {
            path : '/browse',
            name : 'Browse',
            component : Browse
        },
        {
            path : '/hello',
            name : 'Hello',
            component : Hello
        }
    ]
});
