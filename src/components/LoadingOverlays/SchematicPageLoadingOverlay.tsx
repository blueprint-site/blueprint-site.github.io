import LoadingGif from '../../assets/loading.gif';

import '../../styles/schematicpageloadingoverlay.scss';

function SchematicPageLoadingOverlay() {
    return (
        <>
            <div className="loading">
                <h1>Blueprint</h1>
                <img src={LoadingGif} alt="Loading" />
                <h1>This page won't work with Adblocker enabled</h1>
            </div>
        </>
    );
}

export default SchematicPageLoadingOverlay;