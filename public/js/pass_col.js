window.addEventListener('load',()=>{
    const params = (new URL(document.location)).searchParams;
    const college = params.get('college');

    document.getElementById('college').innerHTML = college;
    
})